import usuarioRepo from "../models/modelUsuario";
import bcrypt from "bcrypt";
import env from "../config/config";
import {
  validateCriarMotoristaSchema,
  validateAtualizarSchema,
} from "../validations/motoristaZod";
import { validateCriarPayload } from "../validations/usuarioZod";
import { randomUUID } from "node:crypto";
import motoristaRepository from "../models/modelMotorista";
import { padronizaMotoristas } from "../helpers/padronizers/padronizeMotorista";
import { TypeMotoristaNaoPadronizado } from "../helpers/padronizers/padronizeUsuario";

export const criarMotorista = async (req: any, res: any) => {
  try {
    const placaEmUso = await motoristaRepository.findOne({
      "veiculo.placa": req.body.veiculo.placa,
    });

    if (placaEmUso && placaEmUso.veiculo.placa)
      return res
        .status(409)
        .json({ mensagem: "Esta placa já está sendo utilizada!" });

    const resultSchemaUsuario = validateCriarPayload(req.body);
    if (!resultSchemaUsuario.success)
      return res.status(400).json({
        erros: resultSchemaUsuario.errors,
      });

    const usuarioId = `u.${randomUUID()}`;
    resultSchemaUsuario.data.senha = await bcrypt.hash(
      resultSchemaUsuario.data.senha,
      Number(env.ROUNDS)
    );

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
    await motoristaRepository.create(resultSchemaMotorista.data);
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
    const motoristas: TypeMotoristaNaoPadronizado | any =
      await motoristaRepository.find();

    if (motoristas.length === 0)
      return res.status(200).json({
        quantidade: 0,
        motoristas: [],
      });

    const data = padronizaMotoristas(motoristas);
    return res.status(200).json({
      quantidade: motoristas.length,
      motoristas: data,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(500).json({
        mensagem:
          "O servidor está enfrentando problemas. Entre em contato com o suporte!",
      });
  }
};

export const updateMotoristaById = async (req: any, res: any) => {
  try {
    const resultValidate = validateAtualizarSchema(req.body);
    if (!resultValidate.success)
      return res.status(400).json({
        message:
          "Dados inválidos. Acesse a documentação da API para mais informações!\nhttps://github.com/Batissta/express-zod-auth-api",
        errors: resultValidate.errors,
      });

    const { id } = req.params;
    const userToUpdate = await motoristaRepository.findOne({ usuarioId: id });
    if (!userToUpdate?.usuarioId)
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });

    userToUpdate.veiculo = {
      ...userToUpdate?.veiculo,
      ...resultValidate.data.veiculo,
    };
    typeof resultValidate.data.autenticado === "boolean"
      ? (userToUpdate.autenticado = resultValidate.data.autenticado)
      : userToUpdate.autenticado;

    await userToUpdate.save();

    return res.status(200).json({
      message: "Motorista atualizado com sucesso!",
      motorista: validateAtualizarSchema(userToUpdate)?.data,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensagem: error.message,
      });
  }
};
