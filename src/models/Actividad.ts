import mongoose, { Document, Schema } from "mongoose";

export interface IActividad extends Document {
  usuarioId: mongoose.Types.ObjectId;
  nombre: string;
  categoria?: string;
  color?: string;
  activa: boolean;
  creadaEn: Date;
}

const actividadSchema = new Schema<IActividad>(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    activa: {
      type: Boolean,
      default: true,
    },
    creadaEn: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Actividad = mongoose.model<IActividad>("Actividad", actividadSchema);
export default Actividad;
