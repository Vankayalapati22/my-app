// Common type utilities and error types

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export class BusinessError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

export class ValidationError extends Error {
  constructor(
    readonly fieldErrors: Record<string, string[]>,
    message: string = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(
    readonly resource: string,
    readonly id: string
  ) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Type utilities
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function isSuccess<T>(result: Result<T>): result is { ok: true; value: T } {
  return result.ok === true;
}

export function isError<T>(result: Result<T>): result is { ok: false; error: Error } {
  return result.ok === false;
}

// Async result
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export async function tryCatch<T>(
  fn: () => Promise<T>
): AsyncResult<T, Error> {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
