const fs = require('fs');
const path = require('path');

/**
 * Initialize necessary static files for the laboratory service
 */
function initializeDirectories() {
  console.log('Initializing required files for laboratory service...');
  
  // Create static directory for default assets
  const staticDir = path.join(__dirname, '..', 'static');
  if (!fs.existsSync(staticDir)) {
    console.log(`Creating directory: ${staticDir}`);
    fs.mkdirSync(staticDir, { recursive: true });
  }
  
  console.log('File initialization completed.');
}

module.exports = { initializeDirectories };
