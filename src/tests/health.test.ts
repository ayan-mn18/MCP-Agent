import request from 'supertest';
import App from '../app';

const app = new App().app;

describe('Health Routes', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Service is healthy');
      expect(res.body.data).toHaveProperty('status', 'OK');
      expect(res.body.data).toHaveProperty('timestamp');
      expect(res.body.data).toHaveProperty('uptime');
      expect(res.body.data).toHaveProperty('environment');
      expect(res.body.data).toHaveProperty('version');
      expect(res.body.data).toHaveProperty('memory');
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const res = await request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'API information');
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('version');
      expect(res.body.data).toHaveProperty('description');
      expect(res.body.data).toHaveProperty('endpoints');
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('environment');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});
