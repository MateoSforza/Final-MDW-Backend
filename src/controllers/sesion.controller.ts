import { Response } from "express";
import SesionActividad from "../models/SesionActividad";
import { AuthRequest } from "../middlewares/auth.middleware";

// GET /api/sesiones
export const getSesiones = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    const sesiones = await SesionActividad.find({ usuarioId })
      .populate("actividadId", "nombre categoria color")
      .sort({ fecha: -1 });

    res.json(sesiones);
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al obtener sesiones", error: err.message });
  }
};

// POST /api/sesiones
export const crearSesion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { actividadId, fecha, duracionMinutos, nota } = req.body;

    if (!actividadId || !fecha || !duracionMinutos) {
      res.status(400).json({
        message: "actividadId, fecha y duracionMinutos son obligatorios",
      });
      return;
    }

    const nuevaSesion = new SesionActividad({
      usuarioId,
      actividadId,
      fecha,
      duracionMinutos,
      nota,
    });

    const guardada = await nuevaSesion.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al crear sesión", error: err.message });
  }
};

// PUT /api/sesiones/:id
export const actualizarSesion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params;
    const { actividadId, fecha, duracionMinutos, nota } = req.body;

    const sesion = await SesionActividad.findOneAndUpdate(
      { _id: id, usuarioId },
      { actividadId, fecha, duracionMinutos, nota },
      { new: true }
    );

    if (!sesion) {
      res.status(404).json({ message: "Sesión no encontrada" });
      return;
    }

    res.json(sesion);
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al actualizar sesión", error: err.message });
  }
};

// DELETE /api/sesiones/:id
export const eliminarSesion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params;

    const sesion = await SesionActividad.findOneAndDelete({
      _id: id,
      usuarioId,
    });

    if (!sesion) {
      res.status(404).json({ message: "Sesión no encontrada" });
      return;
    }

    res.json({ message: "Sesión eliminada correctamente" });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al eliminar sesión", error: err.message });
  }
};
