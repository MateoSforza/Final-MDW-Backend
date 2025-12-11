import { Response } from "express";
import { AuthRequest } from "../middlewares/authJwt";
import { asyncHandler } from "../middlewares/asyncHandler";
import { badRequest, notFound } from "../utils/ApiError";
import Sesion from "../models/SesionActividad";

// GET /api/sesiones
export const getSesiones = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;

    const sesiones = await Sesion.find({ usuarioId })
      .sort({ fecha: -1 })
      .populate("actividadId"); // opcional, si tu schema lo permite

    res.json(sesiones);
  }
);

// POST /api/sesiones
export const crearSesion = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;
    const { actividadId, fecha, duracionMinutos, nota } = req.body as {
      actividadId?: string;
      fecha?: string;
      duracionMinutos?: number;
      nota?: string;
    };

    if (!actividadId || !fecha || !duracionMinutos) {
      throw badRequest(
        "actividadId, fecha y duracionMinutos son obligatorios"
      );
    }

    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      throw badRequest("La fecha no tiene un formato válido");
    }

    if (duracionMinutos <= 0) {
      throw badRequest("La duración debe ser mayor a 0");
    }

    const nuevaSesion = await Sesion.create({
      usuarioId,
      actividadId,
      fecha: fechaDate,
      duracionMinutos,
      nota,
    });

    res.status(201).json(nuevaSesion);
  }
);

// DELETE /api/sesiones/:id
export const eliminarSesion = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw badRequest("Usuario no autenticado");
    }

    const usuarioId = req.user.id;
    const { id } = req.params;

    const sesion = await Sesion.findOneAndDelete({
      _id: id,
      usuarioId,
    });

    if (!sesion) {
      throw notFound("Sesión no encontrada");
    }

    res.json({ message: "Sesión eliminada correctamente" });
  }
);
