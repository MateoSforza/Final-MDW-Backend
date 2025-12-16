import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes";
import actividadRoutes from "./routes/actividad.routes";
import sesionRoutes from "./routes/sesion.routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();

// Cookies
app.use(cookieParser());

// CORS (local + producción)
const allowedOrigins = [
  "http://localhost:5173",
  "https://final-mdw-frontend.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// JSON
app.use(express.json());

// Conexión MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("Falta la variable de entorno MONGODB_URI");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("🟢 MongoDB conectado"))
  .catch((err) => console.error("🔴 Error MongoDB:", err));

// Healthcheck
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend funcionando" });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/actividades", actividadRoutes);
app.use("/api/sesiones", sesionRoutes);

// Middleware de errores (siempre al final)
app.use(errorHandler);

// Puerto
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
