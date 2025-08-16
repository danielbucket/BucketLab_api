#!/usr/bin/env node

/**
 * Controller Path Debug Script
 * 
 * This script helps diagnose controller import issues on case-sensitive file systems (Ubuntu)
 * vs case-insensitive file systems (macOS).
 */

const path = require('path');
const fs = require('fs');

console.log('=== BucketLab Controller Debug Script ===\n');

// Check current platform
console.log('Platform:', process.platform);
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());
console.log();

// Define paths to check
const pathsToCheck = [
  './laboratory/src/v1/controllers',
  './laboratory/src/v1/controllers/MessagesController',
  './laboratory/src/v1/controllers/messagesController',
  './auth/src/v1/controllers',
  './auth/src/v1/controllers/AccountsController'
];

console.log('=== Directory Existence Check ===');
pathsToCheck.forEach(checkPath => {
  const fullPath = path.resolve(checkPath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${checkPath} -> ${exists ? 'EXISTS' : 'NOT FOUND'}`);
  
  if (exists && fs.statSync(fullPath).isDirectory()) {
    try {
      const contents = fs.readdirSync(fullPath);
      console.log(`   Contents: ${contents.join(', ')}`);
    } catch (err) {
      console.log(`   Error reading directory: ${err.message}`);
    }
  }
});

console.log('\n=== Import Path Test ===');

// Test the actual require paths used in the application
const importTests = [
  {
    description: 'Laboratory MessagesController (current)',
    path: './laboratory/src/v1/controllers/messagesController'
  },
  {
    description: 'Laboratory MessagesController (wrong case)',
    path: './laboratory/src/v1/controllers/MessagesController'
  },
  {
    description: 'Auth AccountsController',
    path: './auth/src/v1/controllers/AccountsController'
  }
];

importTests.forEach(test => {
  try {
    const fullPath = path.resolve(test.path);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${test.description}: PATH EXISTS`);
      
      // Try to require the module
      try {
        const module = require(fullPath);
        const methods = Object.keys(module);
        console.log(`   Available methods: ${methods.join(', ')}`);
      } catch (requireErr) {
        console.log(`   ❌ Require failed: ${requireErr.message}`);
      }
    } else {
      console.log(`❌ ${test.description}: PATH NOT FOUND`);
    }
  } catch (err) {
    console.log(`❌ ${test.description}: ERROR - ${err.message}`);
  }
});

console.log('\n=== Router Import Test ===');

// Test the specific import used in messagesRouter.js
try {
  const routerPath = './laboratory/src/v1/routes/messagesRouter.js';
  if (fs.existsSync(routerPath)) {
    const routerContent = fs.readFileSync(routerPath, 'utf8');
    const importMatch = routerContent.match(/require\(['"`]([^'"`]+)['"`]\)/);
    if (importMatch) {
      const importPath = importMatch[1];
      console.log(`Router imports: ${importPath}`);
      
      // Resolve relative path from router's perspective
      const routerDir = path.dirname(path.resolve(routerPath));
      const resolvedPath = path.resolve(routerDir, importPath);
      const exists = fs.existsSync(resolvedPath);
      
      console.log(`Resolved path: ${resolvedPath}`);
      console.log(`Path exists: ${exists ? '✅ YES' : '❌ NO'}`);
      
      if (exists) {
        try {
          const controller = require(resolvedPath);
          console.log(`Controller methods: ${Object.keys(controller).join(', ')}`);
        } catch (err) {
          console.log(`❌ Import error: ${err.message}`);
        }
      }
    }
  }
} catch (err) {
  console.log(`❌ Router test failed: ${err.message}`);
}

console.log('\n=== Case Sensitivity Test ===');
const testDir = './laboratory/src/v1/controllers';
if (fs.existsSync(testDir)) {
  const entries = fs.readdirSync(testDir);
  console.log('Directory entries with exact casing:');
  entries.forEach(entry => {
    const stat = fs.statSync(path.join(testDir, entry));
    console.log(`  ${stat.isDirectory() ? '📁' : '📄'} ${entry}`);
  });
}

console.log('\n=== Git Repository Case Sensitivity ===');
try {
  const { execSync } = require('child_process');
  const ignoreCase = execSync('git config core.ignorecase', { encoding: 'utf8' }).trim();
  console.log(`Git core.ignorecase: ${ignoreCase}`);
  
  // Show tracked files with controller paths
  const trackedFiles = execSync('git ls-files | grep -E "(messagesController|MessagesController|AccountsController)" | head -10', { encoding: 'utf8' });
  console.log('Git tracked controller files:');
  trackedFiles.split('\n').filter(Boolean).forEach(file => {
    console.log(`  ${file}`);
  });
} catch (err) {
  console.log(`Git info unavailable: ${err.message}`);
}

console.log('\n=== Debug Complete ===');
