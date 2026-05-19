/**
 * Custom application-specific error class to identify operational (expected) errors.
 * Extends the native JavaScript Error object with status codes, automated operational tags, and stack traces.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';
  public readonly isOperational: boolean;

  /**
   * Constructs a new operational error.
   * @param message Descriptive error message
   * @param statusCode HTTP Status Code representing the error (e.g. 404, 400)
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Status is 'fail' for 4xx clients errors, 'error' for 5xx server issues
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the current stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}
