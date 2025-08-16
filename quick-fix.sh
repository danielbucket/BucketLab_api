#!/bin/bash

# Quick fix script for MessagesController bug
echo "=== BucketLab MessagesController Quick Fix ==="
echo "Attempting immediate fixes..."

# Check which compose files are being used
echo "1. Checking active containers:"
docker ps -a | grep -E "(laboratory|auth|app)_server"

echo -e "\n2. Stopping all containers:"
docker-compose down 2>/dev/null
docker-compose -f compose.production.yaml down 2>/dev/null
docker-compose -f compose.optimized.yaml down 2>/dev/null

echo -e "\n3. Checking for case sensitivity issues in source:"
if [ -d "./laboratory/src/v1/controllers/messagesController" ]; then
    echo "Found lowercase 'messagesController' - this might be the issue!"
    echo "Renaming to 'MessagesController'..."
    mv "./laboratory/src/v1/controllers/messagesController" "./laboratory/src/v1/controllers/MessagesController" 2>/dev/null || echo "Rename failed or already correct"
fi

echo -e "\n4. Verifying directory structure:"
if [ -d "./laboratory/src/v1/controllers/MessagesController" ]; then
    echo "MessagesController directory exists"
    ls -la "./laboratory/src/v1/controllers/MessagesController/"
    
    echo -e "\nChecking subdirectories:"
    for dir in GET POST PATCH DELETE; do
        if [ -d "./laboratory/src/v1/controllers/MessagesController/$dir" ]; then
            echo "✓ $dir directory exists"
        else
            echo "✗ $dir directory missing"
        fi
    done
else
    echo "ERROR: MessagesController directory not found!"
    echo "Available directories:"
    ls -la "./laboratory/src/v1/controllers/" 2>/dev/null || echo "Controllers directory not found"
fi

echo -e "\n5. Testing local require:"
cd laboratory 2>/dev/null && node -e "
try { 
    const controller = require('./src/v1/controllers/MessagesController');
    console.log('✓ Local require SUCCESS');
    console.log('Available methods:', Object.keys(controller));
} catch(e) { 
    console.log('✗ Local require FAILED:', e.message);
}" || echo "Cannot test local require"

echo -e "\n6. Rebuilding with production compose:"
cd .. 2>/dev/null
docker-compose -f compose.production.yaml up --build -d

echo -e "\n7. Checking container status:"
sleep 5
docker ps | grep -E "(laboratory|auth|app)_server"

echo -e "\n8. Testing container logs:"
docker logs laboratory_server --tail 20

echo -e "\n=== Quick Fix Complete ==="
echo "If the issue persists, run the full diagnostic script: ./ubuntu-debug.sh"
