import mongoose, { Document, Schema } from "mongoose";

export interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  fechaRegistro: Date;
}

const usuarioSchema = new Schema<IUsuario>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Usuario = mongoose.model<IUsuario>("Usuario", usuarioSchema);
export default Usuario;
