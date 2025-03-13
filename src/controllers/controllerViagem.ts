import usuarioRepository from "../models/modelUsuario";
import viagemRepository from "../models/modelViagem";
import { randomUUID } from "node:crypto";
import { validateCriarViagem } from "../validations/viagemZod";

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

export const queryFindByMotoristaId = async (id: string) => {
  // erro aqui. O motorista existe, mas não é encontrado
  const motoristaIsValid = await usuarioRepository.findOne({
    id,
  });
  console.log(motoristaIsValid);

  if (!motoristaIsValid?.nome) return "ID de motorista inválido!";
  try {
    const motoristaViagens = await viagemRepository.aggregate([
      {
        $lookup: {
          from: "motoristas",
          localField: "usuariosId",
          foreignField: "motoristaId",
          as: "motorista",
        },
      },
    ]);
    console.log(motoristaViagens);

    return motoristaViagens;
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
  }
};

export const findAllViagens = async () => {
  return await viagemRepository.find();
};
