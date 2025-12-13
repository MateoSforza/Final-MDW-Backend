import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuario, { IUsuario } from "../models/Usuario";
import { asyncHandler } from "../middlewares/asyncHandler";
import { badRequest, unauthorized, internalError } from "../utils/ApiError";

// Cargar variables de entorno en este módulo
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno");
}


export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { nombre, email, password } = req.body as {
      nombre?: string;
      email?: string;
      password?: string;
    };

    if (!nombre || !email || !password) {
      throw badRequest("Faltan datos obligatorios (nombre, email, password)");
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      throw badRequest("El email ya está registrado");
    }

    if (password.length < 6) {
      throw badRequest("La contraseña debe tener al menos 6 caracteres");
    }

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario: IUsuario = new Usuario({
      nombre,
      email,
      password: hashed,
    });

    await nuevoUsuario.save();

    res.status(201).json({
      message: "Usuario registrado con éxito",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      throw badRequest("Faltan datos (email y password)");
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      throw unauthorized("Credenciales inválidas");
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      throw unauthorized("Credenciales inválidas");
    }

    let token: string;

    try {
      token = jwt.sign(
        {
          id: usuario._id.toString(),
          email: usuario.email,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
    } catch (err) {
      throw internalError("No se pudo generar el token", err);
    }

    // Guardar token en cookie HttpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      message: "Login exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  }
);

export const logout = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ message: "Logout exitoso" });
});
