import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario, { IUsuario } from "../models/Usuario";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
      return;
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      res.status(400).json({ message: "El email ya está registrado" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario: IUsuario = new Usuario({
      nombre,
      email,
      password: hashed,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error en el servidor", error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Falta JWT_SECRET en variables de entorno");
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        email: usuario.email,
      },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error en el servidor", error: err.message });
  }
};
