import { describe, it, expect, beforeEach } from 'vitest';
import { TestClient } from '../helpers/client.js';

describe('Aktas endpoints', () => {
  let admin, anon;
  let createdId, trackingCode;
  const sampleForm = {
    companyName: 'PT Tes Integ', companyAddress: 'Jl. Tes', capital: '1000000',
    capitalWords: 'Satu Juta', directorName: 'Budi', directorBirthPlace: 'Jakarta',
    directorBirthDate: '1990-01-01', directorOccupation: 'Wiraswasta', directorAddress: 'Jl. A',
    shareholders: 'Budi', businessPurpose: 'Umum', totalShares: '100', shareValue: '10000',
    shareValueWords: 'Sepuluh Ribu', approvedCapital: '500000', approvedCapitalWords: 'Lima Ratus Ribu',
    companyDuration: '50', termLength: '5', signingDate: '2026-08-28', signingCity: 'Jakarta',
  };

  beforeEach(async () => {
    admin = new TestClient();
    anon = new TestClient();
    await admin.login('admin@notaris.com', 'password123');
  });

  it('creates an akta with a tracking code (authenticated)', async () => {
    const res = await admin.post('/api/aktas', {
      aktaType: 'PT_Pendirian',
      clientId: 'C-1',
      clientName: 'Budi Santoso',
      clientEmail: 'budi@test.com',
      formData: sampleForm,
    });
    expect(res.status).toBe(201);
    expect(res.data.akta.trackingCode).toMatch(/^AKT-\d{4}-/);
    createdId = res.data.akta.id;
    trackingCode = res.data.akta.trackingCode;
  });

  it('rejects akta creation without auth', async () => {
    const res = await anon.post('/api/aktas', {
      aktaType: 'PT_Pendirian', clientId: 'C-1', clientName: 'X', formData: sampleForm,
    });
    expect(res.status).toBe(401);
  });

  it('returns 404 for unknown akta type on create', async () => {
    const res = await admin.post('/api/aktas', {
      aktaType: 'NO_SUCH', clientId: 'C-1', clientName: 'Bukan Siapa', formData: {},
    });
    expect(res.status).toBe(404);
  });

  it('gets a created akta by id', async () => {
    const create = await admin.post('/api/aktas', {
      aktaType: 'PT_Pendirian', clientId: 'C-2', clientName: 'Siti', formData: sampleForm,
    });
    const id = create.data.akta.id;
    const res = await admin.get(`/api/aktas/${id}`);
    expect(res.status).toBe(200);
    expect(res.data.akta.clientName).toBe('Siti');
    expect(res.data.akta.progressHistory.length).toBeGreaterThan(0);
  });

  it('updates progress through stages', async () => {
    const create = await admin.post('/api/aktas', {
      aktaType: 'PT_Pendirian', clientId: 'C-3', clientName: 'Joko', formData: sampleForm,
    });
    const id = create.data.akta.id;
    const prog = await admin.post(`/api/aktas/${id}/progress`, {
      stageId: 'penyusunan-akta', status: 'in_progress', notes: 'Menyusun',
    });
    expect(prog.status).toBe(200);
    expect(prog.data.akta.progress).toBeGreaterThan(0);

    const detail = await admin.get(`/api/aktas/${id}`);
    expect(detail.data.akta.currentStage).toBe('penyusunan-akta');
  });

  it('generates and downloads a .docx document', async () => {
    const create = await admin.post('/api/aktas', {
      aktaType: 'PT_Pendirian', clientId: 'C-4', clientName: 'Ayu', formData: sampleForm,
    });
    const id = create.data.akta.id;

    const gen = await admin.post(`/api/aktas/${id}/generate`, {});
    expect(gen.status).toBe(200);
    expect(gen.data.documentPath).toContain('.docx');

    const dl = await admin.get(`/api/aktas/${id}/document`);
    expect(dl.status).toBe(200);
    const buf = Buffer.from(await dl.data);
    expect(buf.subarray(0, 2).toString()).toBe('PK');
  });

  it('public track endpoint returns status + timeline but NOT client data', async () => {
    const create = await admin.post('/api/aktas', {
      aktaType: 'PT_Pendirian', clientId: 'C-5', clientName: 'Rahasia', formData: sampleForm,
    });
    const code = create.data.akta.trackingCode;
    const res = await anon.get(`/api/aktas/track/${code}`);
    expect(res.status).toBe(200);
    expect(res.data.status).toBeDefined();
    expect(res.data.progress).toBeDefined();
    expect(Array.isArray(res.data.timeline)).toBe(true);
    expect(res.data).not.toHaveProperty('clientName');
    expect(res.data).not.toHaveProperty('formData');
  });

  it('public track endpoint returns 404 for unknown code', async () => {
    const res = await anon.get('/api/aktas/track/UNKNOWN-CODE');
    expect(res.status).toBe(404);
  });
});
