import mongoose from "mongoose";

export type TPassageiro = {
  usuarioId: string;
  viagens: [string];
  avaliacoes: [string];
};

const userSchema = new mongoose.Schema<TPassageiro>({
  usuarioId: { type: String, ref: "usuarios", required: true, unique: true },
  viagens: { type: [String], required: true, default: [] },
  avaliacoes: { type: [String], required: true, default: [] },
});

export default mongoose.model<TPassageiro>("passageiros", userSchema);
