import ModelMotorista from "../models/ModelMotorista";
import {
  padronizaMotoristas,
  TypeMotoristaNaoPadronizado,
} from "./padronizeMotorista";

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

export default {
  findAll,
};
