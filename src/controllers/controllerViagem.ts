import usuarioRepository from "../models/modelUsuario";
import motoristaRepo from "../helpers/motoristaRepoMethods";
import viagemRepository from "../models/modelViagem";
import { randomUUID } from "node:crypto";
import {
  validateCriarViagem,
  validateAtualizarViagem,
  tAtualizarViagemSchema,
} from "../validations/viagemZod";

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
  try {
    const result = validateCriarViagem(req.body);
    if (!result.success)
      return res.status(400).json({
        errors: result.errors,
      });

    const id = `v.${randomUUID()}`;

    const novaViagem = await viagemRepository.create({
      id,
      ...result.data,
    });

    if (result.data.motoristaId) {
      const motorista = await usuarioRepository.findOne({
        id: result.data.motoristaId,
      });
      if (!motorista?.nome)
        return res.status(404).json({
          message: "O motorista não foi encontrado!",
        });
      motorista.viagensId.push(id);
      await motorista.save();
    }

    if (!novaViagem.data)
      throw new Error("Um erro ocorreu na validação dos dados.");

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

export const queryFindByMotoristaId = async (motoristaId: string) => {
  try {
    const motoristaIsValid = await motoristaRepo.auxQueryFindById(motoristaId);
    if (!motoristaIsValid) return "ID de motorista inválido!";
    const motoristaViagens = await viagemRepository.find({ motoristaId });
    return {
      ...motoristaIsValid,
      viagens: motoristaViagens,
    };
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
  }
};

export const findAllViagens = async () => {
  return await viagemRepository.find();
};

export const mutationUpdateById = async (id: string, args: any) => {
  const payload = {
    id,
    ...args,
  };
  const validationResult = validateAtualizarViagem(payload);
  if (!validationResult.success) {
    return {
      error: "Dados inválidos!",
      viagem: null,
      details: validationResult.errors,
    };
  }

  const updatedViagem = await viagemRepository.findOneAndUpdate(
    { id: validationResult.data.id },
    { $set: { ...validationResult.data } },
    { new: true }
  );

  if (!(updatedViagem && updatedViagem.origem))
    return { error: "Viagem não encontrada!", viagem: null, details: [] };

  return { error: "", viagem: updatedViagem, details: [] };
};
