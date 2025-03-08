import {
  validateLoginPayload,
  validateCriarPayload,
} from "../schema/UsuarioZod";
import { criarMotorista } from "./controllerMotorista";
import UsuarioRepository from "../models/ModelUsuario";
import { listarMotoristas } from "../controllers/controllerMotorista";
import { randomUUID } from "node:crypto";
import env from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  padronizaResponseUsers,
  padronizaResponseUser,
  TSchemaUserUnpadronized,
} from "../helpers/padronizeUserResponse";

export const criarUsuario = async (req: any, res: any) => {
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

    if (usuarioCriado.tipo === "motorista") {
      req.body = {
        usuarioId: usuarioId,
        veiculo: req.body.veiculo,
      };
      return criarMotorista(req, res);
    }
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

export const listaUsuarios = async (req: any, res: any) => {
  try {
    const users = await UsuarioRepository.find();
    res.status(200).json({
      quantidade: users.length,
      usuarios: users,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
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

export const encontraPeloTipo = async (req: any, res: any) => {
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
