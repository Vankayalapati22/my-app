// Form validation utilities

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,15}$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, (value: any) => string | null>
): Record<keyof T, string | null> {
  const errors: Record< keyof T, string | null> = {} as any;

  for (const key in schema) {
    const validator = schema[key];
    const error = validator(data[key]);
    errors[key] = error;
  }

  return errors;
}
