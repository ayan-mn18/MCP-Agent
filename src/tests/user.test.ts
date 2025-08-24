import request from 'supertest';
import App from '../app';

const app = new App().app;

describe('User Routes', () => {
  const testUser = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123'
  };

  let createdUserId: string;

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User created successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body.data).toHaveProperty('firstName', testUser.firstName);
      expect(res.body.data).toHaveProperty('lastName', testUser.lastName);
      expect(res.body.data).not.toHaveProperty('password');

      createdUserId = res.body.data.id;
    });

    it('should not create user with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const res = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
    });

    it('should not create user with duplicate email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should get all users with pagination', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Users fetched successfully');
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.users)).toBe(true);
    });

    it('should respect pagination parameters', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.data.pagination).toHaveProperty('currentPage', 1);
      expect(res.body.data.pagination).toHaveProperty('itemsPerPage', 5);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID', async () => {
      const res = await request(app)
        .get(`/api/users/${createdUserId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User fetched successfully');
      expect(res.body.data).toHaveProperty('id', createdUserId);
      expect(res.body.data).toHaveProperty('email', testUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/non-existent-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith'
      };

      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User updated successfully');
      expect(res.body.data).toHaveProperty('firstName', updateData.firstName);
      expect(res.body.data).toHaveProperty('lastName', updateData.lastName);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/users/non-existent-id')
        .send({ firstName: 'Test' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .delete('/api/users/non-existent-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });
});
