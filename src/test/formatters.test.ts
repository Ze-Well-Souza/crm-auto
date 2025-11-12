import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhone, formatCPF, formatCNPJ, formatRelativeTime } from '../utils/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(0)).toBe('R$ 0,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(999999.99)).toBe('R$ 999.999,99');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-1000)).toBe('-R$ 1.000,00');
      expect(formatCurrency(-0.01)).toBe('-R$ 0,01');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });
  });

  describe('formatPhone', () => {
    it('should format mobile phone correctly', () => {
      expect(formatPhone('11912345678')).toBe('(11) 91234-5678');
      expect(formatPhone('21987654321')).toBe('(21) 98765-4321');
    });

    it('should format landline phone correctly', () => {
      expect(formatPhone('1132345678')).toBe('(11) 3234-5678');
      expect(formatPhone('2134567890')).toBe('(21) 3456-7890');
    });

    it('should handle invalid phone numbers', () => {
      expect(formatPhone('123')).toBe('123');
      expect(formatPhone('')).toBe('');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
    });

    it('should handle invalid CPF', () => {
      expect(formatCPF('123')).toBe('123');
      expect(formatCPF('')).toBe('');
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('should handle invalid CNPJ', () => {
      expect(formatCNPJ('123')).toBe('123');
      expect(formatCNPJ('')).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent times correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(oneMinuteAgo)).toBe('há 1 minuto');
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('há 5 minutos');
      expect(formatRelativeTime(oneHourAgo)).toBe('há 1 hora');
      expect(formatRelativeTime(yesterday)).toBe('há 1 dia');
    });

    it('should format future times correctly', () => {
      const now = new Date();
      const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
      const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(inOneHour)).toBe('em 1 hora');
      expect(formatRelativeTime(inTwoDays)).toBe('em 2 dias');
    });
  });
});