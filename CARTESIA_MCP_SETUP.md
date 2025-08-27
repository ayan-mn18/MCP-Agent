# Cartesia MCP Server Setup Guide

## Overview

This guide will help you set up and connect the Cartesia Documentation MCP Server to VS Code and Claude Desktop. The MCP server provides AI assistants with intelligent access to Cartesia's documentation through RAG (Retrieval-Augmented Generation).

## Prerequisites

1. **Environment Setup**: Ensure your `.env` file contains:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=documentation-embeddings
   ```

2. **Cartesia Documentation Data**: Ensure you have crawled and vectorized Cartesia documentation in the `cartesia-docs-2024` namespace:
   ```bash
   curl -X POST http://localhost:3000/api/vector/crawl-and-store \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://docs.cartesia.ai",
       "maxDepth": 3,
       "maxPages": 100,
       "namespace": "cartesia-docs-2024",
       "chunkSize": 1000
     }'
   ```

## Setup Instructions

### 1. Test the MCP Server Locally

First, test that the server works correctly:

```bash
cd /Users/bizer/Development/Projects/MCP-Agent

# Test the server
node cartesia-mcp-server.js
```

The server should start and wait for MCP messages via stdin/stdout.

### 2. VS Code Configuration

#### Method A: Using Claude Dev Extension

1. **Install Claude Dev Extension** in VS Code
2. **Configure MCP Server** in VS Code settings (`settings.json`):

```json
{
  "claudeDev.mcpServers": [
    {
      "name": "cartesia-docs",
      "command": "node",
      "args": ["/Users/bizer/Development/Projects/MCP-Agent/cartesia-mcp-server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

#### Method B: Using MCP Extension (if available)

1. Install any available MCP extension for VS Code
2. Add server configuration to the extension settings

### 3. Claude Desktop Configuration

Create or update your Claude Desktop MCP configuration file:

**Location**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cartesia-docs": {
      "command": "node",
      "args": ["/Users/bizer/Development/Projects/MCP-Agent/cartesia-mcp-server.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### 4. Alternative: Using npx

If you prefer using npx, modify the configuration to use:

```json
{
  "command": "npx",
  "args": [
    "ts-node",
    "-r", "tsconfig-paths/register",
    "/Users/bizer/Development/Projects/MCP-Agent/src/mcp/CartesiaMCPServer.ts"
  ]
}
```

## Available Tools

Once connected, the MCP server provides these tools to AI assistants:

### 1. `query_cartesia_docs`
- **Purpose**: Ask questions about Cartesia documentation
- **Returns**: Intelligent answers with source citations
- **Example**: "How do I use Cartesia's text-to-speech API?"

### 2. `search_cartesia_docs`
- **Purpose**: Search for specific information
- **Returns**: Raw relevant content sections
- **Example**: "API authentication methods"

### 3. `get_cartesia_namespace_stats`
- **Purpose**: Get knowledge base statistics
- **Returns**: Vector count, coverage metrics

## Usage Examples

### In Claude Desktop

Once configured, you can ask Claude questions like:

```
"Use the Cartesia docs tool to explain how to implement streaming audio with their API"

"Search the Cartesia documentation for voice cloning examples"

"What are the rate limits for Cartesia's API according to their docs?"
```

### In VS Code with Claude Dev

The tools will be available in the Claude Dev interface, allowing you to:

- Ask documentation questions while coding
- Get context-aware help about Cartesia integration
- Search for specific implementation details

## Troubleshooting

### Common Issues

1. **Server Won't Start**
   - Check that all environment variables are set
   - Ensure Node.js dependencies are installed
   - Verify the file paths in configuration

2. **No Response from Tools**
   - Check that the `cartesia-docs-2024` namespace has data
   - Verify Pinecone and OpenAI API connectivity
   - Check server logs for errors

3. **Tools Not Available**
   - Restart Claude Desktop or VS Code
   - Verify MCP server configuration syntax
   - Check that the server process is running

### Debug Mode

Enable debug logging by setting environment variable:

```bash
LOG_LEVEL=debug node cartesia-mcp-server.js
```

### Verify Data Availability

Check if the namespace has data:

```bash
curl http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats
```

## Server Management

### Starting the Server

```bash
# Development mode
npm run dev

# Production mode
npm start

# Direct MCP server
node cartesia-mcp-server.js
```

### Stopping the Server

The MCP server will automatically stop when the parent process (Claude/VS Code) disconnects.

### Updating Documentation

To refresh the documentation data:

1. Re-crawl the documentation:
   ```bash
   curl -X POST http://localhost:3000/api/vector/crawl-and-store \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://docs.cartesia.ai",
       "namespace": "cartesia-docs-2024",
       "maxPages": 100
     }'
   ```

2. Restart the MCP server to pick up new data

## Security Notes

- The MCP server only provides read access to documentation
- No sensitive data is exposed through the tools
- All API calls are logged for monitoring
- Rate limiting is handled by the underlying services

## Next Steps

1. **Test the connection** by asking simple questions
2. **Customize the namespace** if you want different documentation sets
3. **Add more tools** by extending the MCP server
4. **Monitor usage** through the health endpoints

For additional help, check the main application logs or contact support.
