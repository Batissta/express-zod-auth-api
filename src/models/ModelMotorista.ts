import mongoose from "mongoose";

export type TVeiculo = {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
};

export type TMotorista = {
  usuarioId: string;
  veiculo: TVeiculo;
  autenticado: boolean;
};

const veiculoSchema = new mongoose.Schema<TVeiculo>({
  ano: { type: Number, required: true },
  cor: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  placa: { type: String, required: true, unique: true },
});

const motoristaSchema = new mongoose.Schema<TMotorista>({
  usuarioId: { type: String, ref: "usuarios", required: true, unique: true },
  veiculo: { type: veiculoSchema, required: true },
  autenticado: { type: Boolean, required: true, default: false },
});

export default mongoose.model<TMotorista>("motoristas", motoristaSchema);
