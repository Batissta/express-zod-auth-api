import usuarioRepo from "../models/modelUsuario";
import { validateCriarMotoristaSchema } from "../validations/motoristaZod";
import { validateCriarPayload } from "../validations/usuarioZod";
import { randomUUID } from "node:crypto";
import motoristaRepo from "../helpers/motoristaRepoMethods";
import motoristaRepos from "../models/modelMotorista";

export const criarMotorista = async (req: any, res: any) => {
  const placaEmUso = await motoristaRepos.findOne({
    veiculo: {
      placa: req.body.veiculo.placa,
    },
  });

  if (placaEmUso)
    return res
      .status(409)
      .json({ mensagem: "Esta placa já está sendo utilizada!" });

  try {
    const resultSchemaUsuario = validateCriarPayload(req.body);
    if (!resultSchemaUsuario.success)
      return res.status(400).json({
        erros: resultSchemaUsuario.errors,
      });

    const usuarioId = `u.${randomUUID()}`;

    const resultSchemaMotorista = validateCriarMotoristaSchema({
      usuarioId,
      ...req.body,
    });
    if (!resultSchemaMotorista.success)
      return res.status(400).json({
        erros: resultSchemaMotorista.errors,
      });

    await usuarioRepo.create({
      id: usuarioId,
      ...resultSchemaUsuario.data,
    });
    await motoristaRepo.create(resultSchemaMotorista.data);
    return res.status(201).json({
      mensagem: "Motorista criado com sucesso!",
      usuarioId: resultSchemaMotorista.data?.usuarioId,
      veiculo: resultSchemaMotorista.data?.veiculo,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};

export const listarMotoristas = async (req: any, res: any) => {
  try {
    const motoristas = await motoristaRepo.findAll();
    if (!motoristas)
      return res.status(200).json({
        quantidade: 0,
        motoristas: [],
      });

    return res.status(200).json({
      quantidade: motoristas.length,
      motoristas: motoristas,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(500).json({
        mensagem:
          "O servidor está enfrentando problemas. Entre em contato com o suporte!",
      });
  }
};
