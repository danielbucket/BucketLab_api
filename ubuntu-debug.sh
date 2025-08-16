#!/bin/bash

# BucketLab API Ubuntu Server Diagnostic Script
echo "======================================"
echo "BucketLab API Ubuntu Server Diagnostics"
echo "======================================"
echo "Date: $(date)"
echo "Host: $(hostname)"
echo "User: $(whoami)"
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

echo "7. Laboratory Container File Structure:"
echo "--------------------------------------"
docker exec laboratory_server find /laboratory/src/v1/controllers -name "*.js" 2>/dev/null || echo "Cannot access laboratory container"
echo ""

echo "8. MessagesController Module Test:"
echo "---------------------------------"
docker exec laboratory_server node -e "try { console.log('SUCCESS:', require('/laboratory/src/v1/controllers/MessagesController')); } catch(e) { console.log('ERROR:', e.message); }" 2>/dev/null || echo "Cannot test MessagesController"
echo ""

echo "9. Node.js Module Resolution Test:"
echo "---------------------------------"
docker exec laboratory_server sh -c "cd /laboratory/src/v1/routes && node -e \"try { console.log('RESOLVE SUCCESS:', require.resolve('../controllers/MessagesController')); } catch(e) { console.log('RESOLVE ERROR:', e.message); }\"" 2>/dev/null || echo "Cannot test module resolution"
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
