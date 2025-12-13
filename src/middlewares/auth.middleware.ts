import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
}

// Extendemos Request para poder usar req.user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if ((req as any).cookies && (req as any).cookies.token) {
      token = (req as any).cookies.token;
    }

    if (!token) {
      res.status(401).json({ message: "No autorizado. Token no provisto." });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Falta JWT_SECRET en variables de entorno");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
