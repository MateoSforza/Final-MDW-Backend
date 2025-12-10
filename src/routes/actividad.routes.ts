import { Router } from "express";
import {
  getActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
} from "../controllers/actividad.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getActividades);
router.post("/", authMiddleware, crearActividad);
router.put("/:id", authMiddleware, actualizarActividad);
router.delete("/:id", authMiddleware, eliminarActividad);

export default router;
