#!/usr/bin/env node

/**
 * Cartesia MCP Server Setup and Verification Script
 * 
 * This script helps you set up and verify the Cartesia MCP server
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function checkEnvironment() {
  log('\n🔍 Checking environment...', colors.blue);

  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', colors.red);
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX_NAME'];

  for (const varName of requiredVars) {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=`)) {
      log(`⚠️  ${varName} might not be set properly`, colors.yellow);
    } else {
      log(`✅ ${varName} is configured`, colors.green);
    }
  }

  return true;
}

async function checkNamespaceData() {
  log('\n📊 Checking for Cartesia documentation data...', colors.blue);

  return new Promise((resolve) => {
    exec('curl -s http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats', (error, stdout, stderr) => {
      if (error) {
        log('❌ Could not check namespace data. Is the server running?', colors.red);
        log('   Start the server with: npm run dev', colors.yellow);
        resolve(false);
        return;
      }

      try {
        const response = JSON.parse(stdout);
        if (response.success) {
          log('✅ Cartesia documentation data found', colors.green);
          log(`   Vector count: ${response.data?.vectorCount || 'unknown'}`, colors.green);
          resolve(true);
        } else {
          log('❌ No data found in cartesia-docs-2024 namespace', colors.red);
          resolve(false);
        }
      } catch (e) {
        log('❌ Could not parse namespace stats response', colors.red);
        resolve(false);
      }
    });
  });
}

async function setupDocumentationData() {
  log('\n📚 Setting up Cartesia documentation data...', colors.blue);

  const setupData = await question('Do you want to crawl Cartesia documentation now? (y/n): ');

  if (setupData.toLowerCase() !== 'y') {
    log('Skipping documentation setup', colors.yellow);
    return false;
  }

  const url = await question('Enter Cartesia docs URL (default: https://docs.cartesia.ai): ') || 'https://docs.cartesia.ai';
  const maxPages = await question('Max pages to crawl (default: 50): ') || '50';

  log('🕷️ Starting crawl and vectorization...', colors.blue);

  const crawlData = JSON.stringify({
    url,
    maxDepth: 3,
    maxPages: parseInt(maxPages),
    namespace: 'cartesia-docs-2024',
    chunkSize: 1000,
    chunkOverlap: 200
  });

  return new Promise((resolve) => {
    const curlCommand = `curl -X POST http://localhost:3000/api/vector/crawl-and-store -H "Content-Type: application/json" -d '${crawlData}'`;

    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        log('❌ Failed to crawl documentation', colors.red);
        log(`Error: ${error.message}`, colors.red);
        resolve(false);
        return;
      }

      try {
        const response = JSON.parse(stdout);
        if (response.success) {
          log('✅ Documentation crawled and vectorized successfully', colors.green);
          log(`   Pages processed: ${response.data?.pagesProcessed || 'unknown'}`, colors.green);
          log(`   Vectors stored: ${response.data?.vectorsStored || 'unknown'}`, colors.green);
          resolve(true);
        } else {
          log('❌ Crawling failed', colors.red);
          log(`Message: ${response.message}`, colors.red);
          resolve(false);
        }
      } catch (e) {
        log('❌ Could not parse crawl response', colors.red);
        resolve(false);
      }
    });
  });
}

async function testMCPServer() {
  log('\n🔧 Testing MCP server...', colors.blue);

  const serverPath = path.join(__dirname, 'cartesia-mcp-server.js');

  if (!fs.existsSync(serverPath)) {
    log('❌ MCP server script not found', colors.red);
    return false;
  }

  log('Starting MCP server test...', colors.yellow);

  return new Promise((resolve) => {
    const child = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let hasStarted = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('started successfully')) {
        hasStarted = true;
        log('✅ MCP server started successfully', colors.green);
        child.kill('SIGTERM');
        resolve(true);
      }
    });

    child.stderr.on('data', (data) => {
      const errorMsg = data.toString();
      if (errorMsg.includes('Error') || errorMsg.includes('error')) {
        log('❌ MCP server error:', colors.red);
        log(errorMsg, colors.red);
        child.kill('SIGTERM');
        resolve(false);
      }
    });

    child.on('close', (code) => {
      if (!hasStarted) {
        log('❌ MCP server failed to start', colors.red);
        resolve(false);
      }
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!hasStarted) {
        log('⏰ MCP server test timed out', colors.yellow);
        child.kill('SIGTERM');
        resolve(false);
      }
    }, 10000);
  });
}

function generateClaudeConfig() {
  const config = {
    mcpServers: {
      "cartesia-docs": {
        command: "node",
        args: [path.join(__dirname, "cartesia-mcp-server.js")],
        env: {
          NODE_ENV: "production",
          LOG_LEVEL: "info"
        }
      }
    }
  };

  const configPath = path.join(process.env.HOME, 'Library/Application Support/Claude/claude_desktop_config.json');
  const configDir = path.dirname(configPath);

  log('\n⚙️ Generating Claude Desktop configuration...', colors.blue);

  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    let existingConfig = {};
    if (fs.existsSync(configPath)) {
      existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    // Merge configurations
    const mergedConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        ...config.mcpServers
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2));
    log('✅ Claude Desktop configuration updated', colors.green);
    log(`   Config file: ${configPath}`, colors.green);
    return true;
  } catch (error) {
    log('❌ Failed to write Claude Desktop configuration', colors.red);
    log(`Error: ${error.message}`, colors.red);
    return false;
  }
}

function showUsageInstructions() {
  log('\n🎉 Setup Complete!', colors.green + colors.bold);
  log('\n📋 Usage Instructions:', colors.blue + colors.bold);

  log('\n1. In Claude Desktop:', colors.yellow);
  log('   • Restart Claude Desktop to load the new configuration');
  log('   • Ask questions like: "Use the Cartesia docs tool to explain their API"');
  log('   • Available tools: query_cartesia_docs, search_cartesia_docs, get_cartesia_namespace_stats');

  log('\n2. In VS Code:', colors.yellow);
  log('   • Install Claude Dev extension');
  log('   • Add this to your VS Code settings.json:');
  log(`   {
     "claudeDev.mcpServers": [
       {
         "name": "cartesia-docs",
         "command": "node",
         "args": ["${path.join(__dirname, 'cartesia-mcp-server.js')}"]
       }
     ]
   }`, colors.blue);

  log('\n3. Testing:', colors.yellow);
  log('   • Test the server: node cartesia-mcp-server.js');
  log('   • Check namespace: curl http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats');
  log('   • View logs with: LOG_LEVEL=debug node cartesia-mcp-server.js');

  log('\n4. Updating Documentation:', colors.yellow);
  log('   • Re-run this script to refresh data');
  log('   • Or use the API: curl -X POST http://localhost:3000/api/vector/crawl-and-store');

  log('\n📚 For more details, see: CARTESIA_MCP_SETUP.md', colors.blue);
}

async function main() {
  log('\n🚀 Cartesia MCP Server Setup', colors.green + colors.bold);
  log('=====================================', colors.green);

  try {
    // Step 1: Check environment
    const envOk = await checkEnvironment();
    if (!envOk) {
      log('\n❌ Environment setup incomplete. Please check your .env file.', colors.red);
      rl.close();
      return;
    }

    // Step 2: Check if server is running
    log('\nChecking if main server is running...', colors.blue);

    // Step 3: Check for existing documentation data
    const hasData = await checkNamespaceData();

    if (!hasData) {
      await setupDocumentationData();
    }

    // Step 4: Test MCP server
    const mcpOk = await testMCPServer();
    if (!mcpOk) {
      log('\n❌ MCP server test failed. Please check the logs.', colors.red);
      rl.close();
      return;
    }

    // Step 5: Generate configurations
    generateClaudeConfig();

    // Step 6: Show usage instructions
    showUsageInstructions();

  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, colors.red);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
