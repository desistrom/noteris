import { describe, it, expect, beforeEach } from 'vitest';
import { TestClient } from '../helpers/client.js';

describe('Users endpoints (super_admin only)', () => {
  let admin, superAdmin;
  beforeEach(async () => {
    admin = new TestClient();
    superAdmin = new TestClient();
    await admin.login('staff@notaris.com', 'password123');
    await superAdmin.login('admin@notaris.com', 'password123');
  });

  it('forbids non-super-admin from listing users', async () => {
    const res = await admin.get('/api/users');
    expect(res.status).toBe(403);
  });

  it('allows super-admin to list users', async () => {
    const res = await superAdmin.get('/api/users');
    expect(res.status).toBe(200);
    expect(res.data.users.length).toBeGreaterThanOrEqual(2);
  });

  it('allows super-admin to create a user', async () => {
    const email = `newuser${Date.now()}@test.com`;
    const res = await superAdmin.post('/api/users', {
      name: 'New User', email, password: 'password123', role: 'admin',
    });
    expect(res.status).toBe(201);
    expect(res.data.user.role).toBe('admin');
  });

  it('forbids non-super-admin from creating a user', async () => {
    const res = await admin.post('/api/users', {
      name: 'X', email: `x${Date.now()}@test.com', password: 'password123', role: 'admin',
    });
    expect(res.status).toBe(403);
  });

  it('allows super-admin to delete a user', async () => {
    const email = `del${Date.now()}@test.com`;
    const create = await superAdmin.post('/api/users', {
      name: 'ToDelete', email, password: 'password123', role: 'admin',
    });
    const id = create.data.user.id;
    const del = await superAdmin.del(`/api/users/${id}`);
    expect(del.status).toBe(200);

    const list = await superAdmin.get('/api/users');
    expect(list.data.users.find((u) => u.id === id)).toBeUndefined();
  });
});
