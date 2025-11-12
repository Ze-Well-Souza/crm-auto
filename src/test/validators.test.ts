import { describe, it, expect } from 'vitest';
import { validateCNPJ, validateCPF, validateEmail, validatePhone } from '../utils/validators';

describe('Validators', () => {
  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(validateCPF('123.456.789-09')).toBe(true);
      expect(validateCPF('12345678909')).toBe(true);
    });

    it('should invalidate incorrect CPF', () => {
      expect(validateCPF('123.456.789-00')).toBe(false);
      expect(validateCPF('12345678900')).toBe(false);
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('')).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('should validate correct CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('should invalidate incorrect CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-82')).toBe(false);
      expect(validateCNPJ('11222333000182')).toBe(false);
      expect(validateCNPJ('123456789')).toBe(false);
      expect(validateCNPJ('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.com.br')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should invalidate incorrect emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('(11) 91234-5678')).toBe(true);
      expect(validatePhone('11912345678')).toBe(true);
      expect(validatePhone('(21) 3234-5678')).toBe(true);
      expect(validatePhone('2132345678')).toBe(true);
    });

    it('should invalidate incorrect phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('invalid')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });
});