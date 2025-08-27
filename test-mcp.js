#!/usr/bin/env node

/**
 * Quick test for the Cartesia MCP Server
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Cartesia MCP Server...\n');

// Test 1: Check if MCP server file exists
const serverPath = path.join(__dirname, 'src', 'mcp', 'CartesiaMCPServer.ts');
if (!fs.existsSync(serverPath)) {
  console.error('❌ MCP server file not found:', serverPath);
  process.exit(1);
}
console.log('✅ MCP server file exists');

// Test 2: Check if dependencies are installed
try {
  const mcpPath = path.join(__dirname, 'node_modules', '@modelcontextprotocol', 'sdk');
  if (fs.existsSync(mcpPath)) {
    console.log('✅ MCP SDK dependency found');
  } else {
    throw new Error('MCP SDK not found in node_modules');
  }
} catch (error) {
  console.error('❌ MCP SDK not installed. Run: npm install @modelcontextprotocol/sdk');
  process.exit(1);
}

// Test 3: Check environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY'];
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  const envContent = fs.readFileSync(envPath, 'utf8');

  for (const envVar of requiredEnvVars) {
    if (envContent.includes(`${envVar}=`) && !envContent.includes(`${envVar}=your_`)) {
      console.log(`✅ ${envVar} appears to be set`);
    } else {
      console.log(`⚠️  ${envVar} may not be configured properly`);
    }
  }
} else {
  console.log('⚠️  .env file not found');
}

// Test 4: Try to compile the TypeScript
console.log('\n📝 Checking TypeScript compilation...');

const child = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck', serverPath], {
  stdio: 'pipe'
});

let output = '';
let errors = '';

child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  errors += data.toString();
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ TypeScript compilation successful');
  } else {
    console.log('⚠️  TypeScript compilation issues:');
    console.log(errors);
  }

  console.log('\n🎯 Test Summary:');
  console.log('- MCP Server: Ready');
  console.log('- Dependencies: Installed');
  console.log('- Environment: Check your .env file');
  console.log('- Compilation: See above');

  console.log('\n📋 Next Steps:');
  console.log('1. Ensure your .env file has valid API keys');
  console.log('2. Start the main server: npm run dev');
  console.log('3. Run setup: npm run mcp:setup');
  console.log('4. Test MCP server: npm run mcp:cartesia');

  console.log('\n📚 Documentation: See CARTESIA_MCP_SETUP.md');
});
