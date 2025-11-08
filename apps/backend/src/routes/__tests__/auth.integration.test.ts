import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../app';

describe('Auth & Health routes', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });

  it('logs in the demo user and returns a token', async () => {
    const response = await request(app).post('/api/auth/login').send({
      username: 'demo',
      password: 'demo123',
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ username: 'demo' });
    expect(response.body.token).toMatch(/^[^.]+\.[^.]+\.[^.]+$/);
  });

  it('rejects invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      username: 'demo',
      password: 'wrong-pass',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ message: 'Invalid credentials' });
  });

  it('returns profile information for /me when provided a valid token', async () => {
    const login = await request(app).post('/api/auth/login').send({
      username: 'demo',
      password: 'demo123',
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ username: 'demo' });
  });

  it('rejects /me requests without a token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ message: 'Authorization header missing' });
  });
});
