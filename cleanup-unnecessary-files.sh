#!/bin/bash

# BucketLab API Cleanup Script
# Removes unnecessary and duplicate files

echo "🧹 BucketLab API Cleanup - Removing unnecessary files..."
echo "======================================================="

# Create backup first
echo "📦 Creating backup..."
tar -czf "bucketlab-backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=data \
  .

echo "✅ Backup created successfully"
echo ""

echo "🗑️  Removing empty testing server files..."
rm -f ./app/server.testing.js
rm -f ./auth/server.testing.js
rm -f ./laboratory/server.testing.js
echo "   ✅ Removed empty server.testing.js files"

echo ""
echo "🗑️  Removing unused ProfileController structure..."
rm -rf ./laboratory/src/v1/controllers/ProfileController/DELETE_/
rm -rf ./laboratory/src/v1/controllers/ProfileController/GET_/
rm -rf ./laboratory/src/v1/controllers/ProfileController/PATCH_/
rm -rf ./laboratory/src/v1/controllers/ProfileController/POST_/
rm -rf ./laboratory/src/v1/controllers/ProfileController/PUT_/
rm -f ./laboratory/src/v1/routes/profilesRouter.js
echo "   ✅ Removed empty ProfileController directories and router"

echo ""
echo "🗑️  Removing unused middleware..."
rm -f ./app/src/v1/middleware/authMiddleware.js
rm -rf ./app/src/v1/middleware/
echo "   ✅ Removed unused authMiddleware"

echo ""
echo "🗑️  Removing test coverage artifacts..."
rm -rf ./auth/coverage/
rm -rf ./laboratory/coverage/
echo "   ✅ Removed coverage directories"

echo ""
echo "🗑️  Removing duplicate Docker configurations..."
rm -f ./compose.optimized.yaml
rm -f ./compose.linux.yaml
rm -f ./Dockerfile.optimized
echo "   ✅ Removed duplicate compose files and Dockerfile"

echo ""
echo "🗑️  Removing debug script..."
rm -f ./ubuntu-debug.sh
echo "   ✅ Removed Ubuntu debug script"

echo ""
echo "🔍 Checking for other potential cleanup opportunities..."

# Check for .DS_Store files (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null && echo "   🧹 Removed .DS_Store files"

# Check for npm cache files
find . -name ".npm" -type d -exec rm -rf {} + 2>/dev/null && echo "   🧹 Removed .npm cache directories"

# Check for temp files
find . -name "*.tmp" -o -name "*.temp" -type f -delete 2>/dev/null && echo "   🧹 Removed temporary files"

echo ""
echo "📊 Cleanup Summary:"
echo "==================="
echo "✅ Empty testing files removed"
echo "✅ Unused ProfileController structure removed" 
echo "✅ Unused middleware removed"
echo "✅ Test artifacts removed"
echo "✅ Duplicate configurations removed"
echo "✅ Debug utilities removed"
echo ""
echo "🎉 Cleanup completed successfully!"
echo ""
echo "📁 Files that remain:"
echo "   📄 compose.yaml (development)"
echo "   📄 compose.production.yaml (production)"
echo "   📄 Dockerfile.* (production builds)"
echo "   📄 All source code and tests"
echo "   📄 Documentation files"
echo ""
echo "⚠️  Remember to:"
echo "   1. Test your services after cleanup"
echo "   2. Update git to remove tracked files"
echo "   3. Consider adding removed files to .gitignore"
