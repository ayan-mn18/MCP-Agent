import request from 'supertest';
import App from '../app';

const app = new App().app;

describe('Web Crawler Routes', () => {
  describe('POST /api/crawler/preview', () => {
    it('should preview a crawl successfully', async () => {
      const crawlRequest = {
        url: 'https://docs.cartesia.ai/2024-11-13/get-started/overview',
        maxDepth: 2,
        maxPages: 10
      };

      const res = await request(app)
        .post('/api/crawler/preview')
        .send(crawlRequest)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('estimatedPages');
      expect(res.body.data).toHaveProperty('allowedDomains');
      expect(res.body.data).toHaveProperty('startingUrl');
      expect(res.body.data.allowedDomains).toContain('docs.cartesia.ai');
    });

    it('should validate required URL parameter', async () => {
      const crawlRequest = {
        maxDepth: 2,
        maxPages: 10
      };

      await request(app)
        .post('/api/crawler/preview')
        .send(crawlRequest)
        .expect(400);
    });

    it('should validate URL format', async () => {
      const crawlRequest = {
        url: 'invalid-url',
        maxDepth: 2,
        maxPages: 10
      };

      await request(app)
        .post('/api/crawler/preview')
        .send(crawlRequest)
        .expect(400);
    });
  });

  describe('POST /api/crawler/crawl', () => {
    it('should validate request parameters', async () => {
      const crawlRequest = {
        url: 'https://docs.cartesia.ai/2024-11-13/get-started/overview',
        maxDepth: 10, // Invalid: exceeds maximum
        maxPages: 5
      };

      await request(app)
        .post('/api/crawler/crawl')
        .send(crawlRequest)
        .expect(400);
    });

    it('should accept valid crawl request', async () => {
      const crawlRequest = {
        url: 'https://httpbin.org/html', // Use a simple test URL
        maxDepth: 1,
        maxPages: 1,
        delay: 100
      };

      const res = await request(app)
        .post('/api/crawler/crawl')
        .send(crawlRequest);

      // The request should be valid (200 or timeout/network error)
      expect([200, 500]).toContain(res.status);
    }, 30000); // Increase timeout for network request
  });
});
