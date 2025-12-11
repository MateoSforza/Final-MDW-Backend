import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ApiError]", err.statusCode, err.message, err.details);
    }

    return res.status(err.statusCode).json({
      message: err.message,
      details:
        process.env.NODE_ENV !== "production" ? err.details : undefined,
    });
  }

  console.error("[UnhandledError]", err);

  return res.status(500).json({
    message: "Error en el servidor",
  });
}
