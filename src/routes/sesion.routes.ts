import { Router } from "express";
import {
  getSesiones,
  crearSesion,
  eliminarSesion,
} from "../controllers/sesion.controller";
import { verifyToken } from "../middlewares/authJwt";

const router = Router();

// Todas las rutas de sesiones requieren token
router.use(verifyToken);

router.get("/", getSesiones);
router.post("/", crearSesion);
router.delete("/:id", eliminarSesion);

export default router;

