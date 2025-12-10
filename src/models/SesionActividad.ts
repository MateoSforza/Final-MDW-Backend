import mongoose, { Document, Schema } from "mongoose";

export interface ISesionActividad extends Document {
  usuarioId: mongoose.Types.ObjectId;
  actividadId: mongoose.Types.ObjectId;
  fecha: Date;
  duracionMinutos: number;
  nota?: string;
  creadaEn: Date;
}

const sesionActividadSchema = new Schema<ISesionActividad>(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    actividadId: {
      type: Schema.Types.ObjectId,
      ref: "Actividad",
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    duracionMinutos: {
      type: Number,
      required: true,
      min: 1,
    },
    nota: {
      type: String,
      trim: true,
    },
    creadaEn: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const SesionActividad = mongoose.model<ISesionActividad>(
  "SesionActividad",
  sesionActividadSchema
);

export default SesionActividad;
