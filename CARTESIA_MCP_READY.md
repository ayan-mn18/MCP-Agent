# 🚀 Cartesia MCP Server - Complete Setup & Usage Guide

## 📋 What We've Built

I've created a complete **Model Context Protocol (MCP) server** for the 'cartesia-docs-2024' namespace that integrates with your existing RAG system. This allows AI assistants (like Claude in VS Code or Claude Desktop) to intelligently query Cartesia documentation.

## 🎯 Key Features

### 🤖 **Intelligent Documentation Access**
- **Smart Q&A**: Ask questions in natural language and get detailed answers with source citations
- **Semantic Search**: Find relevant documentation sections using vector similarity
- **Context-Aware Responses**: Leverages RAG (Retrieval-Augmented Generation) for accurate answers
- **Source Attribution**: Every response includes relevance scores and source URLs

### 🔧 **Three Powerful Tools**
1. **`query_cartesia_docs`** - Get intelligent answers with citations
2. **`search_cartesia_docs`** - Perform semantic search without answer generation  
3. **`get_cartesia_namespace_stats`** - View knowledge base statistics

## 📁 Files Created

```
MCP-Agent/
├── src/mcp/
│   ├── CartesiaMCPServer.ts      # Main MCP server implementation
│   └── index.ts                  # MCP module exports
├── cartesia-mcp-server.js        # Executable MCP server script
├── setup-cartesia-mcp.js         # Interactive setup and verification
├── test-mcp.js                   # Quick verification script
├── CARTESIA_MCP_SETUP.md         # Detailed setup documentation
└── package.json                  # Updated with MCP scripts
```

## 🚀 Quick Start Guide

### 1. **Verify Setup**
```bash
# Quick verification
node test-mcp.js

# Interactive setup
npm run mcp:setup
```

### 2. **Start Your Main Server**
```bash
npm run dev
```

### 3. **Prepare Documentation Data**

If you haven't already crawled Cartesia docs into the 'cartesia-docs-2024' namespace:

```bash
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai",
    "maxDepth": 3,
    "maxPages": 50,
    "namespace": "cartesia-docs-2024",
    "chunkSize": 1000
  }'
```

### 4. **Test the MCP Server**
```bash
# Test the MCP server directly
npm run mcp:cartesia

# Or test with TypeScript
npm run mcp:test
```

## 🔌 Connect to VS Code

### **Option A: Claude Dev Extension**

1. **Install**: Claude Dev extension from VS Code marketplace
2. **Configure**: Add to your VS Code `settings.json`:

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

3. **Use**: Open Claude Dev and the tools will be available automatically

### **Option B: Future MCP Extensions**

The server is ready for any upcoming VS Code MCP extensions with the same configuration.

## 🖥️ Connect to Claude Desktop

### **Automatic Configuration**
Run the setup script to automatically configure Claude Desktop:

```bash
npm run mcp:setup
```

### **Manual Configuration**
Create/update `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Then restart Claude Desktop.

## 🎪 Usage Examples

### **In Claude Desktop**

After configuration, you can ask:

```
"Use the Cartesia docs tool to explain how to implement streaming audio"

"Search the Cartesia documentation for voice cloning examples"

"What are the authentication requirements for Cartesia's API?"

"Show me the rate limits mentioned in Cartesia's documentation"
```

### **In VS Code with Claude Dev**

The tools integrate seamlessly:
- Ask documentation questions while coding
- Get context-aware help about Cartesia integration
- Search for specific implementation details
- Get code examples with proper citations

## 🔧 Available NPM Scripts

```bash
npm run mcp:cartesia    # Start the MCP server
npm run mcp:setup       # Interactive setup & configuration
npm run mcp:test        # Test with TypeScript directly
```

## 📊 Monitoring & Debugging

### **Check Namespace Data**
```bash
curl http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats
```

### **Debug Mode**
```bash
LOG_LEVEL=debug npm run mcp:cartesia
```

### **Health Check**
```bash
curl http://localhost:3000/api/rag/health
```

## 🔄 Updating Documentation

### **Re-crawl Cartesia Docs**
```bash
# Use the API
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai",
    "namespace": "cartesia-docs-2024",
    "maxPages": 100
  }'

# Or use the setup script
npm run mcp:setup
```

### **Verify Updates**
```bash
curl http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats
```

## 🎯 Tool Capabilities

### **1. `query_cartesia_docs`**
- **Input**: Natural language question
- **Output**: Detailed answer with source citations
- **Example**: "How do I authenticate with Cartesia's API?"

### **2. `search_cartesia_docs`**
- **Input**: Search terms or concepts  
- **Output**: Relevant documentation sections
- **Example**: "streaming audio implementation"

### **3. `get_cartesia_namespace_stats`**
- **Input**: None
- **Output**: Knowledge base statistics
- **Use**: Check data availability and coverage

## 🔐 Security & Best Practices

- ✅ **Read-only access** to documentation
- ✅ **No sensitive data exposure**
- ✅ **Comprehensive logging** for monitoring
- ✅ **Rate limiting** handled by underlying services
- ✅ **Graceful error handling**

## 🐛 Troubleshooting

### **Server Won't Start**
1. Check environment variables in `.env`
2. Ensure Node.js dependencies: `npm install`
3. Verify API connectivity: `npm run dev`

### **No Tools Available**
1. Restart Claude Desktop/VS Code
2. Check MCP configuration syntax
3. Verify server process is running

### **Empty Responses**
1. Check namespace has data: `curl http://localhost:3000/api/rag/namespaces/cartesia-docs-2024/stats`
2. Re-crawl documentation if needed
3. Check API keys and connectivity

### **Get Help**
- Check logs: `LOG_LEVEL=debug npm run mcp:cartesia`
- Run diagnostics: `npm run mcp:setup`
- View detailed docs: `CARTESIA_MCP_SETUP.md`

## 🎉 You're All Set!

Your Cartesia MCP server is ready to provide intelligent documentation access to AI assistants. The server integrates seamlessly with your existing RAG infrastructure and provides powerful, context-aware responses about Cartesia's documentation.

**Next Steps:**
1. Run `npm run mcp:setup` for guided setup
2. Test in Claude Desktop or VS Code
3. Start asking questions about Cartesia's documentation!

---

**Made with ❤️ for intelligent documentation access**
