import { describe, it, expect } from 'vitest';
import { generateTrackingCode } from '../../src/server/routes/aktas.js';

describe('generateTrackingCode', () => {
  it('produces the format AKT-YYYY-XXXXXX', () => {
    const code = generateTrackingCode();
    expect(code).toMatch(/^AKT-\d{4}-[A-Z0-9]{6}$/);
  });

  it('produces unique codes', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateTrackingCode()));
    expect(codes.size).toBe(50);
  });
});
