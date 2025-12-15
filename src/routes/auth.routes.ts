import { Router } from "express";
import { register, login, logout, me } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/authJwt";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Nuevo: quién soy (usa cookie HttpOnly)
router.get("/me", verifyToken, me);

export default router;
