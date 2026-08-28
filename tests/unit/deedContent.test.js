import { describe, it, expect } from 'vitest';
import { deedContent, getDeedContent } from '../../src/lib/deedContent.js';

const EXPECTED_TYPES = [
  'PT_Pendirian', 'PT_Perubahan',
  'Yayasan_Pendirian', 'Yayasan_Perubahan',
  'CV_Pendirian', 'CV_Perubahan',
  'Koperasi_Pendirian', 'Koperasi_Perubahan',
  'Jual_Beli_Tanah', 'Jual_Beli_Properti', 'Jual_Beli_Kendaraan',
  'Perjanjian_Kredit', 'Perjanjian_Sewa', 'Perjanjian_Kerjasama', 'Perjanjian_Pengakuan_Utang',
  'Akta_Hak_Waris', 'Akta_Wasiat', 'Akta_Hibah',
];

describe('deedContent legal templates', () => {
  it('contains all 18 akta types', () => {
    EXPECTED_TYPES.forEach((type) => {
      expect(deedContent[type]).toBeDefined();
    });
  });

  it('each type has preamble, body, fields and stages', () => {
    EXPECTED_TYPES.forEach((type) => {
      const c = deedContent[type];
      expect(typeof c.preamble).toBe('string');
      expect(typeof c.body).toBe('string');
      expect(Array.isArray(c.fields)).toBe(true);
      expect(c.fields.length).toBeGreaterThan(0);
      expect(Array.isArray(c.stages)).toBe(true);
      expect(c.stages.length).toBeGreaterThan(0);
    });
  });

  it('body references placeholders matching defined field names', () => {
    EXPECTED_TYPES.forEach((type) => {
      const c = deedContent[type];
      const fieldNames = new Set(c.fields.map((f) => f.name));
      const placeholders = [...c.body.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
      placeholders.forEach((p) => {
        expect(fieldNames.has(p)).toBe(true);
      });
    });
  });

  it('getDeedContent returns null for unknown type', () => {
    expect(getDeedContent('NOPE')).toBeNull();
  });
});
