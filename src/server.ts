import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app: Application = express();

app.use(cors());
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

// Ruta de prueba
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend funcionando" });
});

// Rutas reales
app.use("/api/auth", authRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
