#!/bin/bash

# Ubuntu Deployment Verification Script
# Run this on Ubuntu server to verify controller paths before starting services

echo "=== BucketLab Ubuntu Deployment Verification ==="
echo "OS: $(uname -a)"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo ""

echo "=== Critical Path Verification ==="

# Check if the exact paths exist that are imported in the code
PATHS_TO_CHECK=(
    "./laboratory/src/v1/controllers/messagesController"
    "./laboratory/src/v1/controllers/messagesController/index.js"
    "./auth/src/v1/controllers/AccountsController"
    "./auth/src/v1/controllers/AccountsController/index.js"
)

for path in "${PATHS_TO_CHECK[@]}"; do
    if [ -e "$path" ]; then
        echo "✅ $path - EXISTS"
    else
        echo "❌ $path - NOT FOUND (THIS WILL CAUSE IMPORT ERRORS!)"
    fi
done

echo ""
echo "=== Import Test ==="

# Test Node.js imports
echo "Testing Node.js require() for critical paths..."

node -e "
try { 
    const controller = require('./laboratory/src/v1/controllers/messagesController');
    console.log('✅ Laboratory messagesController import: SUCCESS');
    console.log('   Available methods:', Object.keys(controller).join(', '));
} catch(e) { 
    console.log('❌ Laboratory messagesController import: FAILED');
    console.log('   Error:', e.message);
}
" 2>/dev/null

node -e "
try { 
    const controller = require('./auth/src/v1/controllers/AccountsController');
    console.log('✅ Auth AccountsController import: SUCCESS');
    console.log('   Available methods:', Object.keys(controller).join(', '));
} catch(e) { 
    console.log('❌ Auth AccountsController import: FAILED');
    console.log('   Error:', e.message);
}
" 2>/dev/null

echo ""
echo "=== Router Import Verification ==="

# Check that routers can import their controllers
echo "Checking router -> controller imports..."

node -e "
try { 
    const router = require('./laboratory/src/v1/routes/messagesRouter.js');
    console.log('✅ messagesRouter.js: Loads successfully');
} catch(e) { 
    console.log('❌ messagesRouter.js: Import failed');
    console.log('   Error:', e.message);
}
"

node -e "
try { 
    const router = require('./auth/src/v1/routes/authRouter.js');
    console.log('✅ authRouter.js: Loads successfully');
} catch(e) { 
    console.log('❌ authRouter.js: Import failed');
    console.log('   Error:', e.message);
}
"

echo ""
echo "=== Service Startup Test ==="

# Test if services can start without import errors
echo "Testing service startup (dry run)..."

echo "Laboratory service:"
node -e "
try { 
    const app = require('./laboratory/src/v1/app.js');
    console.log('✅ Laboratory app loads successfully');
} catch(e) { 
    console.log('❌ Laboratory app failed to load');
    console.log('   Error:', e.message);
}
"

echo "Auth service:"
node -e "
try { 
    const app = require('./auth/src/v1/app.js');
    console.log('✅ Auth app loads successfully');
} catch(e) { 
    console.log('❌ Auth app failed to load');
    console.log('   Error:', e.message);
}
"

echo ""
echo "=== Case Sensitivity Warning ==="
echo "⚠️  IMPORTANT: Ubuntu uses case-sensitive filesystem"
echo "   - Import paths must match exact file/directory names"
echo "   - messagesController ≠ MessagesController ≠ Messagescontroller"
echo "   - Always verify imports match git-tracked filenames"

echo ""
echo "=== Next Steps ==="
echo "If all checks passed (✅):"
echo "1. Run: docker-compose up --build"
echo "2. Test endpoints via curl or browser"
echo ""
echo "If any checks failed (❌):"
echo "1. Fix the import paths in the failing files"
echo "2. Ensure all directory names match exactly"
echo "3. Re-run this verification script"
echo "4. Only deploy after all checks pass"

echo ""
echo "=== Verification Complete ==="
