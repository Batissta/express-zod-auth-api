import mongoose from "mongoose";

export type TMotorista = {
  usuarioId: string;
  viagens: [string];
  avaliacoes: [string];
};

const userSchema = new mongoose.Schema<TMotorista>({
  usuarioId: { type: String, ref: "usuarios", required: true, unique: true },
  viagens: { type: [String], required: true, default: [] },
  avaliacoes: { type: [String], required: true, default: [] },
});

export default mongoose.model<TMotorista>("motoristas", userSchema);
