import ModelMotorista from "../models/modelMotorista";
import {
  padronizaMotoristas,
  padronizaMotorista,
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

export const auxQueryFindById = async (id: any) => {
  try {
    const motorista: TypeMotoristaNaoPadronizado | any =
      await ModelMotorista.aggregate([
        {
          $match: {
            usuarioId: id,
          },
        },
        {
          $lookup: {
            from: `usuarios`,
            localField: "usuarioId",
            foreignField: "id",
            as: "usuario",
          },
        },
      ]);
    return padronizaMotorista(motorista[0]).data;
  } catch (error) {
    return false;
  }
};

export default {
  findAll,
  create,
  findOne,
  auxQueryFindById,
};
