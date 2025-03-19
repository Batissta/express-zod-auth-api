import env from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import UsuarioRepository from "../models/modelUsuario";
import {
  validateLoginPayload,
  validateCriarPayload,
  validateAtualizarPayload,
  eUsuarioTipo,
} from "../validations/usuarioZod";
import {
  padronizaResponseUser,
  padronizaResponseUsers,
  TSchemaUserUnpadronized,
} from "../helpers/padronizeUsuario";
import { deleteMotoristaById } from "./controllerMotorista";

export const createUser = async (req: any, res: any) => {
  try {
    const emailEmUso = await UsuarioRepository.findOne({
      email: req.body.email,
    });
    if (emailEmUso && emailEmUso.nome)
      return res
        .status(409)
        .json({ mensagem: "Este e-mail já está sendo utilizado!" });

    if (req.body.tipo === "motorista")
      return res.status(400).json({
        message:
          "Para a criação de um motorista você precisa fazer um POST em /api/motoristas/",
      });
    const result = validateCriarPayload(req.body);

    if (!result.success)
      return res.status(400).send({
        mensagem:
          "Você enviou algo fora do formato correto, busque a documentação!",
        erros: result.errors,
      });

    result.data.senha = await bcrypt.hash(
      result.data.senha,
      Number(env.ROUNDS)
    );
    result.data.tipo = eUsuarioTipo.passageiro;

    const usuarioCriado: TSchemaUserUnpadronized =
      await UsuarioRepository.create({
        id: `u.${randomUUID()}`,
        ...result.data,
      });

    const userPadronized = padronizaResponseUser(usuarioCriado);
    if (!userPadronized.success)
      return res.status(400).json({
        erros: userPadronized.errors,
      });
    return res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      usuario: userPadronized.data,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};

export const findUsers = async (req: any, res: any) => {
  try {
    const passageiros: any = await UsuarioRepository.find({
      tipo: "passageiro",
    });
    const passageirosResponse = padronizaResponseUsers(passageiros);
    res.status(200).json({
      quantidade: passageirosResponse.length,
      passageiros: passageirosResponse,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensagem: error.message,
      });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const resultValidate = validateAtualizarPayload(req.body);
    if (!resultValidate.success)
      return res.status(400).json({
        message:
          "Dados inválidos. Acesse a documentação da API para mais informações!\nhttps://github.com/Batissta/express-zod-auth-api",
        errors: resultValidate.errors,
      });
    const userToUpdate: TSchemaUserUnpadronized | any =
      await UsuarioRepository.findOneAndUpdate(
        { id },
        { $set: { ...resultValidate.data } },
        { new: true }
      );
    if (!(userToUpdate && userToUpdate.nome))
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    const userResponse = padronizaResponseUser(userToUpdate);
    return res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      usuario: userResponse.data,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensagem: error.message,
      });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const result = validateLoginPayload(req.body);
    if (!result.success)
      return res.status(400).json({
        errors: result.errors,
      });
    const user = await UsuarioRepository.findOne({
      email: result.data.email,
    });

    if (!(user && user.nome))
      return res.status(400).json({ mensagem: "Credenciais Inválidas!" });

    const isThePasswordValid = await bcrypt.compare(
      result.data.senha,
      user.senha
    );

    if (!isThePasswordValid)
      return res.status(400).json({ mensagem: "Credenciais Inválidas!" });

    const token = jwt.sign(user.id, env.SECRET);
    return res.status(200).json({
      mensagem: "Login efetuado com sucesso!",
      authorization: token,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};

export const findById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user: any = await UsuarioRepository.findOne({ id });
    if (!(user && user.nome))
      return res.status(404).json({
        message: "Usuário não encontrado!",
      });
    const passageirosResponse = padronizaResponseUser(user);
    return res.status(200).json({
      usuario: passageirosResponse.data,
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
    const user = await UsuarioRepository.findOne({ id });
    if (!(user && user.nome))
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    if (user.tipo === eUsuarioTipo.motorista)
      return deleteMotoristaById(req, res);

    await user.deleteOne();
    return res.status(204).json();
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensagem: error.message,
      });
  }
};
