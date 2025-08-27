# 🔌 VS Code MCP Connection Guide

## 🎯 Your Cartesia MCP Server is Ready!

**✅ MCP Server Status**: Successfully configured for namespace `cartesia-docs-2024`
**✅ Documentation Data**: 21 vectors loaded from Cartesia docs
**✅ Claude Desktop**: Automatically configured
**✅ Server Path**: `/Users/bizer/Development/Projects/MCP-Agent/cartesia-mcp-server.js`

## 🔧 VS Code Connection Options

### Option 1: Cline (Recommended) 🌟

**Cline** (formerly Claude Dev) is the most popular and stable MCP-compatible extension.

#### Installation:
```vscode-extensions
saoudrizwan.claude-dev
```

#### Configuration:
1. After installing Cline, open VS Code Settings (Cmd+,)
2. Search for "Cline" or "Claude Dev"
3. Add your MCP server configuration:

```json
{
  "cline.mcpServers": [
    {
      "name": "cartesia-docs",
      "command": "node",
      "args": ["/Users/bizer/Development/Projects/MCP-Agent/cartesia-mcp-server.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  ]
}
```

#### Usage:
- Open Cline from the sidebar or Command Palette (Cmd+Shift+P → "Cline")
- The Cartesia docs tools will be automatically available
- Ask questions like: "Use the Cartesia docs to explain their streaming API"

### Option 2: Copilot MCP 🤖

**Copilot MCP** provides MCP integration with GitHub Copilot.

#### Installation:
```vscode-extensions
automatalabs.copilot-mcp
```

#### Configuration:
1. Install the extension
2. Open Command Palette (Cmd+Shift+P)
3. Run "Copilot MCP: Add Server"
4. Enter server details:
   - **Name**: `cartesia-docs`
   - **Command**: `node`
   - **Args**: `/Users/bizer/Development/Projects/MCP-Agent/cartesia-mcp-server.js`

### Option 3: MCP Server Runner 🛠️

**MCP Server Runner** allows you to manage multiple MCP servers.

#### Installation:
```vscode-extensions
zebradev.mcp-server-runner
```

#### Configuration:
1. Install the extension
2. Open Command Palette (Cmd+Shift+P)
3. Run "MCP: Add Server"
4. Configure your Cartesia server

### Option 4: Manual Settings.json Configuration

For any MCP-compatible extension, you can add this to your VS Code `settings.json`:

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

## 🎪 Available Tools in VS Code

Once connected, you'll have access to these powerful tools:

### 1. `query_cartesia_docs` 🤖
**Purpose**: Get intelligent answers with citations
**Example Usage**:
```
"Query the Cartesia docs about how to implement streaming audio with voice cloning"
```

### 2. `search_cartesia_docs` 🔍
**Purpose**: Perform semantic search without generating answers
**Example Usage**:
```
"Search Cartesia docs for API authentication examples"
```

### 3. `get_cartesia_namespace_stats` 📊
**Purpose**: Check knowledge base statistics
**Example Usage**:
```
"Show me the Cartesia documentation statistics"
```

## 💬 Sample Conversations

### Example 1: API Integration Help
```
You: "I need to integrate Cartesia's API into my React app. Use the Cartesia docs tool to show me the authentication process."

AI: [Uses query_cartesia_docs] Based on the Cartesia documentation, here's how to authenticate...
```

### Example 2: Voice Cloning Implementation
```
You: "Search the Cartesia docs for voice cloning examples and show me how to implement it."

AI: [Uses search_cartesia_docs] I found several relevant sections about voice cloning...
```

### Example 3: Debugging API Issues
```
You: "I'm getting rate limit errors with Cartesia API. What does their documentation say about rate limits?"

AI: [Uses query_cartesia_docs] According to the Cartesia documentation, the rate limits are...
```

## 🚀 Quick Start Steps

1. **Install Extension**: Choose from Cline, Copilot MCP, or MCP Server Runner
2. **Configure Server**: Add the Cartesia MCP server details
3. **Start Coding**: Open your project and start asking questions
4. **Test Connection**: Ask "What tools do you have available?" to verify

## 🔍 Verification Steps

### 1. Check Server Status
```bash
# In terminal
node cartesia-mcp-server.js
# Should show: "Cartesia MCP Server started successfully"
```

### 2. Verify Data Availability
```bash
curl http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats
# Should return vector count: 21
```

### 3. Test in VS Code
- Open your MCP-enabled extension
- Ask: "What Cartesia documentation tools are available?"
- You should see the three tools listed

## 🔧 Troubleshooting

### Extension Not Detecting MCP Server
1. **Restart VS Code** after configuration
2. **Check server path** is correct in settings
3. **Verify server starts** manually: `node cartesia-mcp-server.js`
4. **Check VS Code logs** for MCP-related errors

### Server Connection Issues
1. **Ensure main server is running**: `npm run dev`
2. **Check environment variables** in `.env`
3. **Verify Cartesia data exists**: Run stats endpoint
4. **Try debug mode**: `LOG_LEVEL=debug node cartesia-mcp-server.js`

### No Tools Available
1. **Confirm MCP server configuration** in VS Code settings
2. **Restart the extension** or VS Code
3. **Check server logs** for any startup errors
4. **Verify namespace data**: Should have 21 vectors

## 🎯 Pro Tips

### 1. Context-Aware Development
```
"I'm working on a voice chat feature. Use Cartesia docs to help me understand the best practices for real-time audio streaming."
```

### 2. API Implementation
```
"Show me how to handle errors in Cartesia API calls according to their documentation."
```

### 3. Performance Optimization
```
"What does Cartesia documentation say about optimizing API calls for production use?"
```

### 4. Feature Discovery
```
"Search Cartesia docs for any experimental or beta features I should know about."
```

## 📚 Additional Resources

- **Main Documentation**: `CARTESIA_MCP_READY.md`
- **Setup Guide**: `CARTESIA_MCP_SETUP.md`
- **Test Server**: `npm run mcp:test`
- **Setup Script**: `npm run mcp:setup`
- **Server Logs**: `LOG_LEVEL=debug npm run mcp:cartesia`

## 🔄 Updating Documentation

To refresh the Cartesia documentation data:

```bash
# Method 1: Use setup script
npm run mcp:setup

# Method 2: Direct API call
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai",
    "namespace": "cartesia-docs-2024",
    "maxPages": 100
  }'
```

## 🎉 You're Ready!

Your Cartesia MCP server is now ready to integrate with VS Code! Choose your preferred extension and start building amazing voice-enabled applications with intelligent documentation assistance.

**Happy Coding! 🚀**

---

*For detailed setup information, see `CARTESIA_MCP_READY.md`*
