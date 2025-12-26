import { CommonErrors } from "./api-errors.ts";

export interface ValidationRule {
  field: string;
  type?: "string" | "number" | "boolean" | "array" | "object" | "email" | "uuid";
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
}

export function validate(data: any, rules: ValidationRule[]): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  for (const rule of rules) {
    const value = data[rule.field];

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push({
        field: rule.field,
        message: `Field '${rule.field}' is required`,
      });
      continue;
    }

    if (value !== undefined && value !== null && value !== "") {
      if (rule.type) {
        const typeError = validateType(rule.field, value, rule.type);
        if (typeError) {
          errors.push(typeError);
          continue;
        }
      }

      if (rule.type === "string" && typeof value === "string") {
        if (rule.min !== undefined && value.length < rule.min) {
          errors.push({
            field: rule.field,
            message: `Field '${rule.field}' must be at least ${rule.min} characters`,
          });
        }

        if (rule.max !== undefined && value.length > rule.max) {
          errors.push({
            field: rule.field,
            message: `Field '${rule.field}' must be at most ${rule.max} characters`,
          });
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            field: rule.field,
            message: `Field '${rule.field}' has invalid format`,
          });
        }
      }

      if (rule.type === "number" && typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          errors.push({
            field: rule.field,
            message: `Field '${rule.field}' must be at least ${rule.min}`,
          });
        }

        if (rule.max !== undefined && value > rule.max) {
          errors.push({
            field: rule.field,
            message: `Field '${rule.field}' must be at most ${rule.max}`,
          });
        }
      }

      if (rule.custom) {
        const customResult = rule.custom(value);
        if (typeof customResult === "string") {
          errors.push({
            field: rule.field,
            message: customResult,
          });
        } else if (customResult === false) {
          errors.push({
            field: rule.field,
            message: `Field '${rule.field}' failed custom validation`,
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateType(
  field: string,
  value: any,
  type: ValidationRule["type"]
): { field: string; message: string } | null {
  switch (type) {
    case "string":
      if (typeof value !== "string") {
        return { field, message: `Field '${field}' must be a string` };
      }
      break;

    case "number":
      if (typeof value !== "number" || isNaN(value)) {
        return { field, message: `Field '${field}' must be a number` };
      }
      break;

    case "boolean":
      if (typeof value !== "boolean") {
        return { field, message: `Field '${field}' must be a boolean` };
      }
      break;

    case "array":
      if (!Array.isArray(value)) {
        return { field, message: `Field '${field}' must be an array` };
      }
      break;

    case "object":
      if (typeof value !== "object" || Array.isArray(value) || value === null) {
        return { field, message: `Field '${field}' must be an object` };
      }
      break;

    case "email":
      if (typeof value !== "string" || !isValidEmail(value)) {
        return { field, message: `Field '${field}' must be a valid email` };
      }
      break;

    case "uuid":
      if (typeof value !== "string" || !isValidUuid(value)) {
        return { field, message: `Field '${field}' must be a valid UUID` };
      }
      break;
  }

  return null;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function parseRequestBody<T = any>(req: Request): Promise<T> {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await req.json();
    }

    throw CommonErrors.badRequest("Content-Type must be application/json");
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw CommonErrors.badRequest("Invalid JSON in request body");
    }
    throw error;
  }
}

export function validateAndParse<T = any>(
  data: any,
  rules: ValidationRule[]
): T {
  const result = validate(data, rules);

  if (!result.valid) {
    throw CommonErrors.validation("Validation failed", result.errors);
  }

  return data as T;
}
