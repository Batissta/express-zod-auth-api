import {
  validateLoginPayload,
  validateCriarPayload,
} from "../schema/UsuarioZod";
import UsuarioRepository from "../models/ModelUsuario";
import { randomUUID } from "node:crypto";
import env from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { criarPassageiro } from "../controllers/usuariosTipo/ControllerPassageiro";
import {
  padronizaResponseUsers,
  TUserUnsanitized,
} from "../helpers/sanitizeUserResponse";

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
    const usuario = await UsuarioRepository.create({
      id: usuarioId,
      ...zodValidation.data,
    });
    req.body = {
      usuarioId: usuarioId,
    };
    if (usuario.tipo === "passageiro") return await criarPassageiro(req, res);
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

    const usuariosDoTipo: TUserUnsanitized[] =
      await UsuarioRepository.aggregate([
        {
          $lookup: {
            from: `${tipo}`,
            localField: "id",
            foreignField: "usuarioId",
            as: "info",
          },
        },
      ]);
    const responsePadronizada = padronizaResponseUsers(usuariosDoTipo);
    return res.status(200).json({
      quantidade: responsePadronizada.length,
      usuarios: responsePadronizada,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};
