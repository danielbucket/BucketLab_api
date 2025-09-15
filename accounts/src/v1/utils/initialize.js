const fs = require('fs');
const path = require('path');

/**
 * Initialize necessary static files for the accounts service
 * Note: Directories for uploads/avatars are handled by Docker volume mapping
 */
function initializeDirectories() {
  console.log('Initializing required files for accounts service...');
  
  // Create static directory for default assets
  const staticDir = path.join(__dirname, '..', 'static');
  if (!fs.existsSync(staticDir)) {
    console.log(`Creating directory: ${staticDir}`);
    fs.mkdirSync(staticDir, { recursive: true });
  }
  
  // Create a default avatar if it doesn't exist
  const defaultAvatarPath = path.join(staticDir, 'default-avatar.png');
  if (!fs.existsSync(defaultAvatarPath)) {
    console.log('Creating default avatar image...');
    // Create a simple default avatar (1x1 transparent pixel)
    const defaultAvatar = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    fs.writeFileSync(defaultAvatarPath, defaultAvatar);
  }
  
  console.log('File initialization completed.');
}

module.exports = { initializeDirectories };
