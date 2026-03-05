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
  
  async connect(uri) {
    if (this.connection && this.connection.readyState === 1) {
      return this.connection;
    }
    
    try {
      this.connection = await mongoose.connect(uri || process.env.MONGO_URI);
      console.log('Database connected successfully');
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
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
