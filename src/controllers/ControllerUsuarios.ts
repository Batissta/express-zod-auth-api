import {
  validateLoginPayload,
  validateCriarPayload,
} from "../schema/UsuarioZod";
import UsuarioRepository from "../models/ModelUsuario";
import { listarMotoristas, criarMotorista } from "./controllerMotorista";
import { randomUUID } from "node:crypto";
import env from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  padronizaResponseUsers,
  padronizaResponseUser,
  TSchemaUserUnpadronized,
} from "../helpers/padronizeUsuario";

import usuarioRepo from "../helpers/usuarioRepoMethods";
import motoristaRepo from "../helpers/motoristaRepoMethods";

// o usuário está sendo criado mesmo sem os dados de motorista estarem corretos.
// devo retornar uma mensagem ajustada caso já exista um usuário com o mesmo e-mail
// desacoplar esse código é uma necessidade!

export const createUser = async (req: any, res: any) => {
  const emailEmUso = await UsuarioRepository.findOne({ email: req.body.email });
  if (emailEmUso)
    return res
      .status(409)
      .json({ mensagem: "Este e-mail já está sendo utilizado!" });
  if (req.body.tipo === "motorista") return criarMotorista(req, res);
  try {
    const zodValidation = validateCriarPayload(req.body);

    if (!zodValidation.success)
      return res.status(400).send({
        mensagem:
          "Você enviou algo fora do formato correto, busque a documentação!",
        erros: zodValidation.errors,
      });

    const usuarioId = `u.${randomUUID()}`;
    zodValidation.data.senha = await bcrypt.hash(
      zodValidation.data.senha,
      Number(env.ROUNDS)
    );

    const usuarioCriado: TSchemaUserUnpadronized =
      await UsuarioRepository.create({
        id: usuarioId,
        ...zodValidation.data,
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
    const passageiros = await usuarioRepo.find({ tipo: "passageiro" });
    const motoristas = await motoristaRepo.findAll();
    res.status(200).json({
      quantidadePassageiros: passageiros.length,
      passageiros: passageiros,
      quantidadeMotoristas: motoristas.length,
      motoristas: motoristas,
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
    const zodValidation = validateLoginPayload(req.body);
    if (!zodValidation.success)
      return res.status(400).json({
        errors: zodValidation.errors,
      });

    const user = await UsuarioRepository.findOne({
      email: zodValidation.data.email,
    });
    if (!user)
      return res.status(400).json({ mensagem: "Credenciais Inválidas!" });

    const isThepasswordValid = await bcrypt.compare(
      zodValidation.data.senha,
      user.senha
    );

    if (!isThepasswordValid)
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

export const findByType = async (req: any, res: any) => {
  try {
    const { tipo } = req.params;
    if (!(tipo == "passageiros" || tipo == "motoristas"))
      return res.status(400).json({
        mensage: "Tipo inválido!",
      });
    if (tipo == "motoristas") return listarMotoristas(req, res);
    const passageiros = await UsuarioRepository.find({ tipo: "passageiro" });
    const passageirosResponse = padronizaResponseUsers(passageiros);
    return res.status(200).json({
      quantidade: passageirosResponse.length,
      pessoas: passageirosResponse,
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
    const user = await UsuarioRepository.find({ id });
    if (!user)
      return res.status(404).json({
        message: "Usuário não encontrado!",
      });
    // const passageirosResponse = padronizaResponseUser(user);
    return res.status(200).json({
      pessoas: user,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};
