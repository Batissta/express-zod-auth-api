import ModelMotorista from "../models/ModelMotorista";
import {
  padronizaMotorista,
  padronizaMotoristas,
  TypeMotoristaNaoPadronizado,
} from "./padronizeMotorista";

export const findOne = async (payload: any) => {
  const motorista: TypeMotoristaNaoPadronizado | any =
    await ModelMotorista.findOne(payload);

  return padronizaMotorista(motorista);
};

export const findAll = async () => {
  const motoristas: TypeMotoristaNaoPadronizado | any =
    await ModelMotorista.aggregate([
      {
        $lookup: {
          from: `usuarios`,
          localField: "usuarioId",
          foreignField: "id",
          as: "usuario",
        },
      },
    ]);
  return padronizaMotoristas(motoristas);
};

export const create = async (payload: any) => {
  const motorista: TypeMotoristaNaoPadronizado | any =
    await ModelMotorista.create(payload);
  return padronizaMotorista(motorista);
};

export default {
  findAll,
  create,
  findOne,
};
