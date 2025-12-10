import { Response } from "express";
import Actividad from "../models/Actividad";
import { AuthRequest } from "../middlewares/auth.middleware";

// GET /api/actividades
export const getActividades = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    const actividades = await Actividad.find({
      usuarioId,
      activa: true,
    }).sort({ creadaEn: -1 });

    res.json(actividades);
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al obtener actividades", error: err.message });
  }
};

// POST /api/actividades
export const crearActividad = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { nombre, categoria, color } = req.body;

    if (!nombre) {
      res.status(400).json({ message: "El nombre es obligatorio" });
      return;
    }

    const nuevaActividad = new Actividad({
      usuarioId,
      nombre,
      categoria,
      color,
    });

    const guardada = await nuevaActividad.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al crear actividad", error: err.message });
  }
};

// PUT /api/actividades/:id
export const actualizarActividad = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params;
    const { nombre, categoria, color, activa } = req.body;

    const actividad = await Actividad.findOneAndUpdate(
      { _id: id, usuarioId },
      { nombre, categoria, color, activa },
      { new: true }
    );

    if (!actividad) {
      res.status(404).json({ message: "Actividad no encontrada" });
      return;
    }

    res.json(actividad);
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al actualizar actividad", error: err.message });
  }
};

// DELETE /api/actividades/:id (baja lógica)
export const eliminarActividad = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params;

    const actividad = await Actividad.findOneAndUpdate(
      { _id: id, usuarioId },
      { activa: false },
      { new: true }
    );

    if (!actividad) {
      res.status(404).json({ message: "Actividad no encontrada" });
      return;
    }

    res.json({ message: "Actividad desactivada correctamente" });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res
      .status(500)
      .json({ message: "Error al eliminar actividad", error: err.message });
  }
};
