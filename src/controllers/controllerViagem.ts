import usuarioRepository from "../models/modelUsuario";
import viagemRepository from "../models/modelViagem";
import { validateCriarViagem } from "../schema/viagemZod";
import { randomUUID } from "node:crypto";

export const findViagens = async (req: any, res: any) => {
  try {
    const viagens = await viagemRepository.find();
    return res.status(200).json({
      quantidade: viagens.length,
      viagens,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        message: error.message,
      });
  }
};

export const createViagem = async (req: any, res: any) => {
  const motoristaIsValid = await usuarioRepository.findOne({
    id: req.body.motoristaId,
    tipo: "motorista",
  });

  if (!motoristaIsValid?.nome)
    return res.status(404).json({
      message: "ID de motorista inválido!",
    });
  try {
    const result = validateCriarViagem(req.body);
    if (!result.success)
      return res.status(400).json({
        errors: result.errors,
      });

    const id = `${result.data.motoristaId}.${result.data.data}.${result.data.hora.horas}:${result.data.hora.minutos}`;
    const viagemIsValid = await viagemRepository.findOne({ id });
    if (viagemIsValid?.motoristaId)
      return res.status(409).json({
        message: "Esse motorista já possui uma viagem no mesmo dia e horário!",
      });
    const novaViagem = await viagemRepository.create({
      id,
      ...result.data,
    });
    return res.status(201).json({
      message: "Viagem criada com sucesso!",
      viagem: novaViagem,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        message: error.message,
      });
  }
};
