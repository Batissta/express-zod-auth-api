import PassageiroRepository from "../../models/usuariosTipo/ModelPassageiro";
import {
  validateCriarPayload,
  validateAtualizarPayload,
} from "../../schema/usuariosTipo/PassageiroZod";

export const criarPassageiro = async (req: any, res: any) => {
  try {
    const validateResponse = validateCriarPayload(req.body);
    if (!validateResponse.success)
      return res.status(400).json({
        erros: validateResponse.errors,
      });

    await PassageiroRepository.create({
      usuarioId: validateResponse.data.usuarioId,
      viagens: [],
      avaliacoes: [],
    });
    return res.status(201).json({
      mensagem: "Passageiro criado com sucesso!",
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensagem: error.message,
      });
  }
};

export const atualizaPassageiro = async (req: any, res: any) => {
  try {
    const validateResponse = validateAtualizarPayload(req.body);
    if (!validateResponse.success)
      return res.status(400).json({
        erros: validateResponse.errors,
      });
    const userToChange = await PassageiroRepository.findOne({
      usuarioId: validateResponse.data.usuarioId,
    });
    const sopraver = userToChange;
    if (!userToChange)
      return res.status(404).json({
        mensagem: "Não foi encontrado nenhum usuário com este ID.",
      });
    const { usuarioId, ...data } = validateResponse.data;
    data.viagemId ? userToChange.viagens.push(data.viagemId) : "";
    data.avaliacaoId ? userToChange.avaliacoes.push(data.avaliacaoId) : "";

    await userToChange.save();

    return res.status(200).json({
      mensagem: "O usuário foi alterado com sucesso!",
      antes: sopraver,
      depois: userToChange,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};
