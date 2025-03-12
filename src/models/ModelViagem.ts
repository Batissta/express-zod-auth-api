import mongoose from "mongoose";

export type TViagem = {
  id: string;
  motoristaId: string;
  passageirosId: [string];
  data: Date;
  hora: {
    horas: number;
    minutos: number;
  };
  origem: string;
  destino: string;
};

const viagemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  motoristaId: { type: String, required: true },
  passageirosId: { type: [String], default: [] },
  data: { type: Date, required: true },
  hora: {
    horas: { type: Number, required: true },
    minutos: { type: Number, required: true },
  },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
});

export default mongoose.model<TViagem>("viagens", viagemSchema);
