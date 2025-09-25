// Validation utilities for form inputs and data integrity

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate CPF format and check digit
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false; // All same digits
  
  // Check digit validation
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

/**
 * Validate CNPJ format and check digit
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false; // All same digits
  
  // Check digit validation
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cleaned.charAt(12))) return false;
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return digit2 === parseInt(cleaned.charAt(13));
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Validate license plate format (old and new Brazilian formats)
 */
export const isValidLicensePlate = (plate: string): boolean => {
  const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  // Old format: ABC1234
  const oldFormat = /^[A-Z]{3}[0-9]{4}$/;
  // New format: ABC1D23
  const newFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  
  return oldFormat.test(cleaned) || newFormat.test(cleaned);
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate year range
 */
export const isValidYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
};

/**
 * Validate required string field
 */
export const isRequiredString = (value: string | null | undefined): boolean => {
  return Boolean(value && value.trim().length > 0);
};