import {
  validateLoginPayload,
  validateCriarPayload,
} from "../schema/UsuarioZod";
import UsuarioRepository from "../models/ModelUsuario";
import { randomUUID } from "node:crypto";
import env from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  criarUsuario: async (req: any, res: any) => {
    const zodValidation = validateCriarPayload(req.body);

    if (!zodValidation.success)
      return res.status(400).send({
        mensagem:
          "Você enviou algo fora do formato correto, busque a documentação!",
        erros: zodValidation.errors,
      });

    try {
      const usuarioId = randomUUID();
      const senhaCriptografada = await bcrypt.hash(
        req.body.senha,
        Number(env.ROUNDS)
      );
      await UsuarioRepository.create({
        id: usuarioId,
        ...zodValidation.data,
        senha: senhaCriptografada,
      });

      return res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        usuarioId,
        senhaCriptografada,
      });
    } catch (error: any) {
      return res.status(400).send({ mensagem: error.message });
    }
  },

  listaUsuarios: async (req: any, res: any) => {
    const users = await UsuarioRepository.find();
    res.status(200).json({
      quantidade: users.length,
      usuarios: users,
    });
  },

  login: async (req: any, res: any) => {
    const zodValidation = validateLoginPayload(req.body);
    if (!zodValidation.success)
      return res.status(400).json({
        errors: zodValidation.errors,
      });

    try {
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
    } catch (error: any) {
      return res.status(200).json({
        mensagem: error.message,
      });
    }
  },
};
