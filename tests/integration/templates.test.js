import { describe, it, expect, beforeEach } from 'vitest';
import { TestClient } from '../helpers/client.js';

describe('Templates endpoints', () => {
  let admin, staff, superAdmin;
  beforeEach(async () => {
    admin = new TestClient();
    staff = new TestClient();
    superAdmin = new TestClient();
    await admin.login('admin@notaris.com', 'password123');
    await staff.login('staff@notaris.com', 'password123');
    await superAdmin.login('admin@notaris.com', 'password123');
  });

  it('lists all seeded templates publicly', async () => {
    const res = await admin.get('/api/templates');
    expect(res.status).toBe(200);
    expect(res.data.templates.length).toBe(18);
  });

  it('gets a template by type with its fields', async () => {
    const res = await admin.get('/api/templates/type/PT_Pendirian');
    expect(res.status).toBe(200);
    expect(res.data.template.name).toContain('Perseroan Terbatas');
    expect(res.data.template.fields.length).toBeGreaterThan(0);
  });

  it('returns 404 for unknown template type', async () => {
    const res = await admin.get('/api/templates/type/DOES_NOT_EXIST');
    expect(res.status).toBe(404);
  });

  it('forbids template creation for non-super-admin', async () => {
    const res = await staff.post('/api/templates', {
      name: 'X', aktaType: 'X_TEST', category: 'Y',
      description: '', content: '', stages: [{ id: 's1', name: 'Stage 1', order: 0 }],
      fields: [{ name: 'f1', label: 'F1', type: 'text', required: true }],
    });
    expect(res.status).toBe(403);
  });

  it('allows super-admin to create a template', async () => {
    const res = await superAdmin.post('/api/templates', {
      name: 'Custom Akta', aktaType: `CUSTOM_${Date.now()}`, category: 'Lainnya',
      description: 'test', content: '', stages: [{ id: 's1', name: 'Stage 1', order: 0 }],
      fields: [{ name: 'f1', label: 'F1', type: 'text', required: true }],
    });
    expect(res.status).toBe(201);
    expect(res.data.template.id).toBeDefined();
  });
});
