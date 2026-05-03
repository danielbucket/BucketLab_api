const mongoose = require('mongoose');

class DatabaseConnection {
  static instance = null;
  
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = null;
    DatabaseConnection.instance = this;
  }
  
  async connect(uri, maxRetries = 10) {
    if (this.connection && this.connection.readyState === 1) {
      return this.connection;
    }
    
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.connection = await mongoose.connect(uri || process.env.MONGO_URI);
        console.log('Database connected successfully');
        return this.connection;
      } catch (error) {
        lastError = error;
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
        console.error(`Database connection attempt ${attempt}/${maxRetries} failed. Retrying in ${delay}ms...`, error.message);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error('Database connection failed after all retries');
    throw lastError;
  }
  
  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('Database disconnected');
    }
  }
  
  getConnection() {
    return this.connection;
  }
  
  isConnected() {
    return this.connection && this.connection.readyState === 1;
  }
}

module.exports = new DatabaseConnection();
