import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { unauthorized } from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno");
}

export function verifyToken(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if ((req as any).cookies && (req as any).cookies.token) {
    token = (req as any).cookies.token;
  }

  if (!token) {
    throw unauthorized("Token no proporcionado");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as {
      id: string;
      email: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw unauthorized("Token expirado");
    }
    throw unauthorized("Token inválido");
  }
}
