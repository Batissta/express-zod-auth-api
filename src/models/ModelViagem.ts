import mongoose from "mongoose";

export type TViagem = {
  id: string;
  motoristaId: string;
  passageirosId: [string];
  data: String;
  hora: {
    horas: number;
    minutos: number;
  };
  origem: string;
  destino: string;
  status: "confirmada" | "concluida" | "pendente";
};

const viagemSchema = new mongoose.Schema<TViagem>({
  id: { type: String, required: true, unique: true },
  motoristaId: { type: String, ref: "motoristas", default: "" },
  passageirosId: { type: [String], ref: "usuarios", default: [] },
  data: { type: String, required: true },
  hora: {
    horas: { type: Number, required: true },
    minutos: { type: Number, required: true },
  },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  status: {
    type: String,
    enum: ["confirmada", "concluida", "pendente"],
    default: "pendente",
  },
});

export default mongoose.model<TViagem>("viagens", viagemSchema);
