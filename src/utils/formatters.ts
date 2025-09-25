// Utility functions for consistent data formatting across the application

/**
 * Format currency values to Brazilian Real
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  });
};

/**
 * Format date to Brazilian format
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Format phone number to Brazilian format
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Format CPF/CNPJ
 */
export const formatCpfCnpj = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 11) {
    // CPF format
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.length === 14) {
    // CNPJ format
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  return value;
};

/**
 * Format license plate
 */
export const formatLicensePlate = (plate: string): string => {
  const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return plate.toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Generate random ID for mock data
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};