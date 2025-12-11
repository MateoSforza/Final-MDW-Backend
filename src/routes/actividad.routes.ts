import { Router } from "express";
import {
  getActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
} from "../controllers/actividad.controller";
import { verifyToken } from "../middlewares/authJwt";

const router = Router();

// Todas las rutas de actividades requieren token
router.use(verifyToken);

router.get("/", getActividades);
router.post("/", crearActividad);
router.put("/:id", actualizarActividad);
router.delete("/:id", eliminarActividad);

export default router;
