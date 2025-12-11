import { Response } from "express";
import Actividad from "../models/Actividad";
import { AuthRequest } from "../middlewares/authJwt";
import { asyncHandler } from "../middlewares/asyncHandler";
import { badRequest, notFound } from "../utils/ApiError";

// GET /api/actividades
export const getActividades = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;

    const actividades = await Actividad.find({
      usuarioId,
      activa: true,
    }).sort({ creadaEn: -1 });

    res.json(actividades);
  }
);

// POST /api/actividades
export const crearActividad = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;
    const { nombre, categoria, color } = req.body as {
      nombre?: string;
      categoria?: string;
      color?: string;
    };

    if (!nombre) {
      throw badRequest("El nombre es obligatorio");
    }

    const nuevaActividad = new Actividad({
      usuarioId,
      nombre,
      categoria,
      color,
    });

    const guardada = await nuevaActividad.save();
    res.status(201).json(guardada);
  }
);

// PUT /api/actividades/:id
export const actualizarActividad = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;
    const { id } = req.params;
    const { nombre, categoria, color, activa } = req.body as {
      nombre?: string;
      categoria?: string;
      color?: string;
      activa?: boolean;
    };

    const actividad = await Actividad.findOneAndUpdate(
      { _id: id, usuarioId },
      { nombre, categoria, color, activa },
      { new: true }
    );

    if (!actividad) {
      throw notFound("Actividad no encontrada");
    }

    res.json(actividad);
  }
);

// DELETE /api/actividades/:id (baja lógica)
export const eliminarActividad = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;
    const { id } = req.params;

    const actividad = await Actividad.findOneAndUpdate(
      { _id: id, usuarioId },
      { activa: false },
      { new: true }
    );

    if (!actividad) {
      throw notFound("Actividad no encontrada");
    }

    res.json({ message: "Actividad desactivada correctamente" });
  }
);
