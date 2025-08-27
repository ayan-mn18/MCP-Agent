#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

// Build and run the MCP server
const serverPath = path.join(__dirname, 'src', 'mcp', 'CartesiaMCPServer.ts');
const command = `npx ts-node -r tsconfig-paths/register ${serverPath}`;

console.log('Starting Cartesia MCP Server...');
console.log('Server path:', serverPath);

const child = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error starting MCP server:', error);
    process.exit(1);
  }

  if (stderr) {
    console.error('Server stderr:', stderr);
  }

  if (stdout) {
    console.log('Server stdout:', stdout);
  }
});

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.stdin.pipe(process.stdin);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down MCP server...');
  child.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  console.log('Shutting down MCP server...');
  child.kill('SIGTERM');
});
