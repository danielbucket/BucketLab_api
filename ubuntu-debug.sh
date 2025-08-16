#!/bin/bash

# BucketLab API Ubuntu Server Diagnostic Script
echo "======================================"
echo "BucketLab API Ubuntu Server Diagnostics"
echo "======================================"
echo "Date: $(date)"
echo "Host: $(hostname)"
echo "User: $(whoami)"
echo "Git Branch: $(git branch --show-current 2>/dev/null || echo 'Not a git repo')"
echo "Git Commit: $(git rev-parse HEAD 2>/dev/null || echo 'No git commit')"
echo ""

echo "1. System Information:"
echo "----------------------"
uname -a
docker --version
docker-compose --version
echo ""

echo "2. Current Docker Containers:"
echo "-----------------------------"
docker ps -a
echo ""

echo "3. Docker Networks:"
echo "------------------"
docker network ls
echo ""

echo "4. Available Compose Files:"
echo "---------------------------"
ls -la *compose*.yaml *docker-compose*.yml 2>/dev/null || echo "No compose files found in current directory"
echo ""

echo "5. Current Directory Contents:"
echo "-----------------------------"
ls -la
echo ""

echo "6. Laboratory Container Logs (last 30 lines):"
echo "---------------------------------------------"
docker logs laboratory_server --tail 30 2>/dev/null || echo "Laboratory container not found or not running"
echo ""

echo "8. Laboratory Container File Structure:"
echo "--------------------------------------"
echo "=== CONTROLLERS DIRECTORY ==="
docker exec laboratory_server find /laboratory/src/v1/controllers -type d 2>/dev/null || echo "Cannot access laboratory container"
echo ""
echo "=== MESSAGESCONTROLLER STRUCTURE ==="
docker exec laboratory_server ls -la /laboratory/src/v1/controllers/MessagesController/ 2>/dev/null || echo "Cannot access MessagesController directory"
echo ""
echo "=== SUBDIRECTORY CONTENTS ==="
for dir in GET POST PATCH DELETE; do
    echo "--- $dir directory ---"
    docker exec laboratory_server ls -la /laboratory/src/v1/controllers/MessagesController/$dir/ 2>/dev/null || echo "Cannot access $dir directory"
done
echo ""

echo "9. EXACT ERROR REPRODUCTION:"
echo "============================"
echo "=== Container startup logs ==="
docker logs laboratory_server 2>&1 | tail -50
echo ""
echo "=== Test module require directly ==="
docker exec laboratory_server node -e "
try { 
  console.log('SUCCESS: MessagesController loaded');
  const controller = require('/laboratory/src/v1/controllers/MessagesController');
  console.log('Controller keys:', Object.keys(controller));
  console.log('GET_ methods:', Object.keys(controller.GET_ || {}));
} catch(error) { 
  console.log('ERROR:', error.message);
  console.log('Stack:', error.stack);
}" 2>/dev/null || echo "Cannot execute in container"
echo ""
echo "=== Test router require ==="
docker exec laboratory_server node -e "
const path = require('path');
process.chdir('/laboratory/src/v1/routes');
console.log('Current directory:', process.cwd());
console.log('Files in current directory:', require('fs').readdirSync('.'));
try {
  const controller = require('../controllers/MessagesController');
  console.log('SUCCESS: Router can load MessagesController');
} catch(error) {
  console.log('ROUTER ERROR:', error.message);
  console.log('Module resolution paths:', require.resolve.paths('../controllers/MessagesController'));
}
" 2>/dev/null || echo "Cannot test router require"
echo ""

echo "10. CASE SENSITIVITY TEST:"
echo "=========================="
docker exec laboratory_server node -e "
const fs = require('fs');
const path = '/laboratory/src/v1/controllers';
console.log('Directory contents (case sensitive check):');
try {
  const files = fs.readdirSync(path);
  files.forEach(file => {
    const stats = fs.statSync(path + '/' + file);
    console.log(file + (stats.isDirectory() ? '/' : ''), 'Type:', stats.isDirectory() ? 'DIR' : 'FILE');
  });
} catch(e) {
  console.log('Error reading directory:', e.message);
}

console.log('\\nTesting MessagesController variations:');
const variations = ['MessagesController', 'messagesController', 'Messagescontroller'];
variations.forEach(variation => {
  try {
    const fullPath = path + '/' + variation;
    const exists = fs.existsSync(fullPath);
    console.log(variation + ': ' + (exists ? 'EXISTS' : 'NOT FOUND'));
    if (exists) {
      const stats = fs.statSync(fullPath);
      console.log('  Type:', stats.isDirectory() ? 'DIRECTORY' : 'FILE');
    }
  } catch(e) {
    console.log(variation + ': ERROR -', e.message);
  }
});
" 2>/dev/null || echo "Cannot perform case sensitivity test"
echo ""

echo "10. File Permissions Check:"
echo "--------------------------"
docker exec laboratory_server ls -la /laboratory/src/v1/controllers/ 2>/dev/null || echo "Cannot check file permissions"
echo ""

echo "11. MessagesController Index File Content:"
echo "-----------------------------------------"
docker exec laboratory_server cat /laboratory/src/v1/controllers/MessagesController/index.js 2>/dev/null || echo "Cannot read MessagesController index.js"
echo ""

echo "12. Routes File Content:"
echo "-----------------------"
docker exec laboratory_server cat /laboratory/src/v1/routes/messagesRouter.js 2>/dev/null || echo "Cannot read messagesRouter.js"
echo ""

echo "13. Docker Container Resources:"
echo "------------------------------"
docker stats --no-stream laboratory_server 2>/dev/null || echo "Cannot get container stats"
echo ""

echo "======================================"
echo "Diagnostic Complete"
echo "======================================"
