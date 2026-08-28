import { describe, it, expect, beforeEach } from 'vitest';
import { TestClient } from '../helpers/client.js';

describe('Auth endpoints', () => {
  let client;
  beforeEach(() => {
    client = new TestClient();
  });

  it('registers a new user', async () => {
    const res = await client.register(`user${Date.now()}@test.com`, 'password123', 'Tester');
    expect(res.status).toBe(201);
    expect(res.data.userId).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    const email = `dup${Date.now()}@test.com`;
    await client.register(email, 'password123', 'Tester');
    const res = await client.register(email, 'password123', 'Tester');
    expect(res.status).toBe(400);
  });

  it('logs in with valid credentials and sets a session cookie', async () => {
    const res = await client.login('admin@notaris.com', 'password123');
    expect(res.status).toBe(200);
    expect(res.data.user.role).toBe('super_admin');
    expect(res.setCookie).toContain('auth_session=');
  });

  it('rejects login with wrong password', async () => {
    const res = await client.login('admin@notaris.com', 'wrongpass');
    expect(res.status).toBe(401);
  });

  it('returns the current user when authenticated', async () => {
    await client.login('admin@notaris.com', 'password123');
    const res = await client.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.data.user.email).toBe('admin@notaris.com');
  });

  it('returns 401 on /auth/me without a session', async () => {
    const res = await client.get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('logs out and invalidates the session', async () => {
    await client.login('admin@notaris.com', 'password123');
    const logout = await client.logout();
    expect(logout.status).toBe(200);
    const me = await client.get('/api/auth/me');
    expect(me.status).toBe(401);
  });
});
