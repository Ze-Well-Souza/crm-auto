import { useState } from 'react';
import { z } from 'zod';
import { useNotifications } from '@/contexts/NotificationContext';

interface ValidationResult<T> {
  data: T | null;
  errors: Record<string, string>;
  isValid: boolean;
}

interface UseZodValidationReturn<T> {
  validate: (data: any) => ValidationResult<T>;
  validateField: (fieldName: string, value: any) => string | null;
  clearErrors: () => void;
  errors: Record<string, string>;
  isValid: boolean;
}

export function useZodValidation<T>(schema: z.ZodSchema<T>): UseZodValidationReturn<T> {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);
  const notifications = useNotifications();

  const validate = (data: any): ValidationResult<T> => {
    try {
      const validatedData = schema.parse(data);
      setErrors({});
      setIsValid(true);
      
      return {
        data: validatedData,
        errors: {},
        isValid: true
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.');
          fieldErrors[fieldName] = err.message;
        });

        setErrors(fieldErrors);
        setIsValid(false);

        // Mostrar notificação de erro de validação para o primeiro campo com erro
        const firstError = error.errors[0];
        if (firstError) {
          const fieldName = firstError.path.join('.');
          notifications.showValidationError(fieldName, firstError.message);
        }

        return {
          data: null,
          errors: fieldErrors,
          isValid: false
        };
      }

      // Erro não relacionado ao Zod
      const genericError = "Erro de validação inesperado";
      setErrors({ general: genericError });
      setIsValid(false);
      notifications.showError(genericError);

      return {
        data: null,
        errors: { general: genericError },
        isValid: false
      };
    }
  };

  const validateField = (fieldName: string, value: any): string | null => {
    try {
      // Valida o valor diretamente sem usar pick
      const testData = { [fieldName]: value };
      schema.parse(testData);
      
      // Remove o erro do campo se a validação passou
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(fieldName));
        const errorMessage = fieldError?.message || "Erro de validação";
        
        setErrors(prev => ({
          ...prev,
          [fieldName]: errorMessage
        }));
        
        return errorMessage;
      }
      
      return "Erro de validação inesperado";
    }
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(true);
  };

  return {
    validate,
    validateField,
    clearErrors,
    errors,
    isValid
  };
}

// Hook específico para validação de formulários com React Hook Form
export function useZodFormValidation<T>(schema: z.ZodSchema<T>) {
  const { validate, validateField, clearErrors, errors } = useZodValidation(schema);
  const notifications = useNotifications();

  const handleSubmit = async (
    data: any,
    onSuccess: (validatedData: T) => Promise<void> | void,
    onError?: (errors: Record<string, string>) => void
  ) => {
    const result = validate(data);
    
    if (result.isValid && result.data) {
      try {
        await onSuccess(result.data);
      } catch (error) {
        notifications.showError(
          error instanceof Error ? error.message : "Erro ao processar formulário"
        );
      }
    } else {
      onError?.(result.errors);
    }
  };

  return {
    validate,
    validateField,
    clearErrors,
    errors,
    handleSubmit
  };
}

// Hook para validação em tempo real
export function useRealtimeValidation<T>(
  schema: z.ZodSchema<T>,
  debounceMs: number = 300
) {
  const { validateField, errors, clearErrors } = useZodValidation(schema);
  const [timeouts, setTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  const validateFieldRealtime = (fieldName: string, value: any) => {
    // Limpa o timeout anterior para este campo
    if (timeouts[fieldName]) {
      clearTimeout(timeouts[fieldName]);
    }

    // Cria um novo timeout para validação com debounce
    const newTimeout = setTimeout(() => {
      validateField(fieldName, value);
      setTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[fieldName];
        return newTimeouts;
      });
    }, debounceMs);

    setTimeouts(prev => ({
      ...prev,
      [fieldName]: newTimeout
    }));
  };

  const cleanup = () => {
    Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
    setTimeouts({});
    clearErrors();
  };

  return {
    validateFieldRealtime,
    errors,
    clearErrors,
    cleanup
  };
}