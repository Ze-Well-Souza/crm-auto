import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhone } from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats number as Brazilian currency', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
      expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date to Brazilian format', () => {
      const date = '2024-01-26T10:30:00';
      expect(formatDate(date)).toBe('26/01/2024');
    });

    it('handles invalid dates', () => {
      expect(formatDate('invalid')).toBe('Data inválida');
      expect(formatDate('')).toBe('Data inválida');
    });
  });

  describe('formatPhone', () => {
    it('formats Brazilian phone numbers', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('handles already formatted phones', () => {
      const formatted = '(11) 98765-4321';
      expect(formatPhone(formatted)).toBe(formatted);
    });
  });
});
