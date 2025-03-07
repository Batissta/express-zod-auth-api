import mongoose from "mongoose";

export type TUsuario = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: "passageiro" | "motorista";
  viagensId: [string];
  avaliacoesId: [string];
};

const userSchema = new mongoose.Schema<TUsuario>({
  id: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, default: "passageiro", required: true },
  viagensId: { type: [String], required: true, default: [] },
  avaliacoesId: { type: [String], required: true, default: [] },
});

export default mongoose.model<TUsuario>("usuarios", userSchema);
