const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testVectorAPI() {
  console.log('🧪 Testing Vector Database API\n');

  try {
    // Test 1: Test vectorization with a single page
    console.log('1️⃣ Testing single page vectorization...');
    const testResponse = await axios.post(`${BASE_URL}/vector/test`, {
      url: 'https://docs.cartesia.ai/2024-11-13/get-started/overview'
    });

    console.log('✅ Test successful!');
    console.log(`   - Page: ${testResponse.data.data.page.title}`);
    console.log(`   - Word count: ${testResponse.data.data.page.wordCount}`);
    console.log(`   - Chunks generated: ${testResponse.data.data.chunks.totalChunks}`);
    console.log(`   - Estimated tokens: ${testResponse.data.data.estimatedTokens}\n`);

    // Test 2: Preview crawl and vectorization
    console.log('2️⃣ Testing crawl preview...');
    const previewResponse = await axios.post(`${BASE_URL}/vector/preview`, {
      url: 'https://docs.cartesia.ai/2024-11-13/get-started/overview',
      maxDepth: 2,
      maxPages: 5,
      chunkSize: 800
    });

    console.log('✅ Preview successful!');
    console.log(`   - Estimated pages: ${previewResponse.data.data.crawl.estimatedPages}`);
    console.log(`   - Estimated chunks: ${previewResponse.data.data.vectorization.estimatedChunks}`);
    console.log(`   - Estimated cost: $${previewResponse.data.data.vectorization.estimatedCost}`);
    console.log(`   - Chunk size: ${previewResponse.data.data.vectorization.chunkSize}\n`);

    // Test 3: Check if environment variables are configured for full test
    console.log('3️⃣ Testing full crawl and vectorization...');
    console.log('⚠️  Note: This requires OPENAI_API_KEY and PINECONE_API_KEY to be configured\n');

    try {
      const crawlResponse = await axios.post(`${BASE_URL}/vector/crawl-and-store`, {
        url: 'https://docs.cartesia.ai/2024-11-13/get-started/overview',
        maxDepth: 1,
        maxPages: 2,
        chunkSize: 500,
        namespace: 'test-crawl',
        delay: 1000
      });

      console.log('✅ Full crawl and vectorization successful!');
      console.log(`   - Pages crawled: ${crawlResponse.data.data.crawlSummary.totalPages}`);
      console.log(`   - Vectors stored: ${crawlResponse.data.data.vectorsStored}`);
      console.log(`   - Index: ${crawlResponse.data.data.indexName}`);
      console.log(`   - Namespace: ${crawlResponse.data.data.namespace}`);
      console.log(`   - Processing time: ${crawlResponse.data.data.processingDuration}ms`);
      console.log(`   - Embedding model: ${crawlResponse.data.data.embeddings.model}`);
      console.log(`   - Dimensions: ${crawlResponse.data.data.embeddings.dimensions}\n`);

    } catch (vectorError) {
      if (vectorError.response?.status === 500) {
        const errorMessage = vectorError.response.data.message;
        if (errorMessage.includes('API key')) {
          console.log('⚠️  Full vectorization test skipped - API keys not configured');
          console.log('   To test full functionality, set:');
          console.log('   - OPENAI_API_KEY');
          console.log('   - PINECONE_API_KEY');
          console.log('   - PINECONE_ENVIRONMENT');
          console.log('   - PINECONE_INDEX_NAME\n');
        } else {
          console.log('❌ Full vectorization test failed:', errorMessage);
        }
      } else {
        throw vectorError;
      }
    }

    // Test 4: Test API endpoints structure
    console.log('4️⃣ Testing API info endpoint...');
    const apiResponse = await axios.get(`${BASE_URL}`);

    console.log('✅ API info retrieved!');
    console.log('   Available vector endpoints:');
    const vectorEndpoints = apiResponse.data.data.endpoints.vector;
    Object.keys(vectorEndpoints).forEach(key => {
      console.log(`   - ${key}: ${vectorEndpoints[key]}`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\nVector Database API is ready for use.');
    console.log('See VECTOR_API_DOCUMENTATION.md for detailed usage instructions.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Make sure the server is running on http://localhost:3000');
  }
}

testVectorAPI();
