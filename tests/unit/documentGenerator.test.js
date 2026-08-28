import { describe, it, expect } from 'vitest';
import { generateDocument, replacePlaceholders } from '../../src/lib/documentGenerator.js';
import { readFile, stat, unlink } from 'fs/promises';
import { join } from 'path';

const TEMPLATE = { name: 'Akta Pendirian Perseroan Terbatas' };

function makeAkta(aktaType, formData) {
  return {
    id: `unit-${aktaType}`,
    aktaType,
    trackingCode: `AKT-2026-UNIT${aktaType.length}`,
    formData,
  };
}

const SAMPLE = {
  companyName: 'PT Contoh Unit', companyAddress: 'Jl. Tes No. 1', capital: '1000000',
  capitalWords: 'Satu Juta', directorName: 'Budi', directorBirthPlace: 'Jakarta',
  directorBirthDate: '1990-01-01', directorOccupation: 'Wiraswasta', directorAddress: 'Jl. A',
  shareholders: 'Budi', businessPurpose: 'Umum', totalShares: '100', shareValue: '10000',
  shareValueWords: 'Sepuluh Ribu', approvedCapital: '500000', approvedCapitalWords: 'Lima Ratus Ribu',
  companyDuration: '50', termLength: '5', signingDate: '2026-08-28', signingCity: 'Jakarta',
};

describe('documentGenerator (docx)', () => {
  it('replaces placeholders with actual form data', () => {
    const out = replacePlaceholders('Nama: {{sellerName}}, Beli: {{buyerName}}', {
      sellerName: 'Siti', buyerName: 'Joko',
    });
    expect(out).toBe('Nama: Siti, Beli: Joko');
  });

  it('leaves unknown placeholders intact', () => {
    const out = replacePlaceholders('X: {{unknown}}', {});
    expect(out).toContain('{{unknown}}');
  });

  it('generates a non-empty .docx for PT_Pendirian', async () => {
    const path = await generateDocument(makeAkta('PT_Pendirian', SAMPLE), TEMPLATE);
    const full = join(process.cwd(), path);
    const s = await stat(full);
    expect(s.size).toBeGreaterThan(1000);
    const buf = await readFile(full);
    expect(buf.subarray(0, 2).toString()).toBe('PK');
    await unlink(full);
  });

  it('generates a valid .docx for Jual_Beli_Tanah', async () => {
    const path = await generateDocument(makeAkta('Jual_Beli_Tanah', {
      sellerName: 'Siti', buyerName: 'Joko', landLocation: 'Bandung', landArea: '200',
      landCertificate: '123', certificateHolder: 'Siti', price: '50000000', priceWords: 'Lima Puluh Juta',
      paymentMethod: 'Transfer', bphtbBurden: 'Pembeli', pphBurden: 'Penjual',
      signingDate: '2026-08-28', signingCity: 'Bandung',
    }), { name: 'Akta Jual Beli Tanah' });
    const full = join(process.cwd(), path);
    const s = await stat(full);
    expect(s.size).toBeGreaterThan(1000);
    const buf = await readFile(full);
    expect(buf.subarray(0, 2).toString()).toBe('PK');
    await unlink(full);
  });

  it('throws for unknown akta type', async () => {
    await expect(generateDocument(makeAkta('UNKNOWN', {}), TEMPLATE)).rejects.toThrow();
  });
});
