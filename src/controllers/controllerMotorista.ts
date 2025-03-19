import bcrypt from "bcrypt";
import env from "../config/config";
import {
  validateCriarMotoristaSchema,
  validateAtualizarSchema,
} from "../validations/motoristaZod";
import { eUsuarioTipo, validateCriarPayload } from "../validations/usuarioZod";
import { randomUUID } from "node:crypto";
import motoristaRepository from "../models/modelMotorista";
import {
  padronizaMotorista,
  padronizaMotoristas,
} from "../helpers/padronizers/padronizeMotorista";
import usuarioRepository from "../models/modelUsuario";

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

    await usuarioRepository.create({
      id: usuarioId,
      ...resultSchemaUsuario.data,
      tipo: eUsuarioTipo.motorista,
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

export const findById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const motorista: any = await motoristaRepository.findOne({ id });
    if (!motorista)
      return res.status(404).json({
        message: "Motorista não encontrado!",
      });
    const motoristaResponse = padronizaMotorista(motorista);
    return res.status(200).json({
      usuario: motoristaResponse.data,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};

export const deleteById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const motorista = await motoristaRepository.findOne({ id });
    if (!motorista)
      return res.status(404).json({
        message: "Motorista não encontrado!",
      });
    await motorista.deleteOne();
    return res.status(204).json();
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(404).json({
        mensage: error.message,
      });
  }
};

export const findAll = async (req: any, res: any) => {
  try {
    const motorista: any = await motoristaRepository.find();
    const motoristaResponse = padronizaMotoristas(motorista);
    return res.status(200).json({
      quantidade: motoristaResponse.length,
      motoristas: motoristaResponse,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};
