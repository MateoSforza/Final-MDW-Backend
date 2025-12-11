export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new ApiError(400, message, details);

export const unauthorized = (message = "No autorizado") =>
  new ApiError(401, message);

export const notFound = (message = "Recurso no encontrado") =>
  new ApiError(404, message);

export const internalError = (message = "Error interno del servidor", details?: unknown) =>
  new ApiError(500, message, details);
