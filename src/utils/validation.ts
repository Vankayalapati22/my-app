// Form Utilities
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PHONE_REGEX = /^[\d\s\-+()]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return PASSWORD_REGEX.test(password);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateForm(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for required fields
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      errors.push({
        field: key,
        message: `${key} is required`,
      });
    }
  });

  return errors;
}
