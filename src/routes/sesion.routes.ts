import { Router } from "express";
import {
  getSesiones,
  crearSesion,
  actualizarSesion,
  eliminarSesion,
} from "../controllers/sesion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getSesiones);
router.post("/", authMiddleware, crearSesion);
router.put("/:id", authMiddleware, actualizarSesion);
router.delete("/:id", authMiddleware, eliminarSesion);

export default router;
