import usuarioRepository from "../models/modelUsuario";
import viagemRepository from "../models/modelViagem";
import { randomUUID } from "node:crypto";
import {
  validateCriarViagem,
  validateAtualizarViagem,
  validateAdicionarPassageiroParaViagem,
} from "../validations/viagemZod";
import motoristaRepository from "../models/modelMotorista";
import { padronizaMotorista } from "../helpers/padronizeMotorista";

export const mutationCreateViagem = async (args: any) => {
  try {
    const result = validateCriarViagem(args);
    if (!result.success)
      return {
        viagem: {},
        error: "Dados inválidos!",
        details: result.errors,
      };

    const id = `v.${randomUUID()}`;

    if (result.data.motoristaId) {
      const motorista = await usuarioRepository.findOne({
        id: result.data.motoristaId,
      });

      if (!motorista?.nome)
        return {
          viagem: "",
          errors: "Motorista invalido!",
          details: ["Erro 404. Motorista não encontrado!"],
        };
      motorista.viagensId.push(id);
      await motorista.save();
    }
    const novaViagem = await viagemRepository.create({
      id,
      ...result.data,
    });

    return {
      viagem: novaViagem,
      errors: "",
      details: [],
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        viagem: {},
        errors: error.message,
        details: [],
      };
  }
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

  if (validationResult.data.passageiroId) {
    const passageiro = await usuarioRepository.findOne({
      id: validationResult.data.passageiroId,
    });
    if (!passageiro?.nome)
      return {
        viagem: null,
        error: "Passageiro não encontrado!",
        details: [],
      };
    passageiro?.viagensId.push(validationResult.data.id);
    await passageiro?.save();
  }

  if (validationResult.data.passageirosId) {
    validationResult.data.passageirosId.forEach(async (p, i) => {
      const passageiro = await usuarioRepository.findOne({
        id: p,
      });
      if (!passageiro?.nome)
        return {
          viagem: null,
          error: `${i + 1}° passageiro não foi encontrado!`,
          details: [],
        };
      passageiro?.viagensId.push(validationResult.data.id);
      await passageiro?.save();
    });
  }

  const updatedViagem = await viagemRepository.findOneAndUpdate(
    { id: validationResult.data.id },
    {
      $set: { ...validationResult.data },
      $push: {
        ...(validationResult.data.passageiroId && {
          passageirosId: validationResult.data.passageiroId,
        }),
      },
    },
    { new: true }
  );

  if (!(updatedViagem && updatedViagem.origem))
    return { error: "Viagem não encontrada!", viagem: null, details: [] };

  return { error: "", viagem: updatedViagem, details: [] };
};

// remover a possibilidade de alterar o motorista ou passageiros por aqui e criar mutations separadas.
export const mutationDeleteById = async (id: string) => {
  try {
    const idValido = validateAtualizarViagem({ id });
    if (!idValido.success) return "ID inválido.";
    const viagem = await viagemRepository.findOneAndDelete({ id });
    if (!viagem?.origem) return "Viagem não encontrada!";
    return "Viagem deletada com sucesso!";
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
  }
};

export const deletePassageiroFromViagemById = async (
  viagemId: string,
  passageiroId: string
) => {
  try {
    const result = validateAdicionarPassageiroParaViagem({
      id: viagemId,
      passageiroId,
    });
    if (!result.success) return `${result.errors.toString()}`;

    const viagemIsValid = await viagemRepository.findOne({ id: viagemId });
    if (!viagemIsValid?.origem) return "A viagem não foi encontrada.";

    const passageiroValid = await usuarioRepository.findOne({
      id: passageiroId,
    });

    if (
      !passageiroValid?.nome ||
      !viagemIsValid.passageirosId.some((pas) => pas === passageiroValid.id)
    )
      return "O passageiro não foi encontrado.";

    passageiroValid.viagensId = passageiroValid.viagensId.filter((vId) => {
      return vId !== viagemId;
    }) as [string];
    await passageiroValid.save();

    viagemIsValid.passageirosId = viagemIsValid.passageirosId.filter((pId) => {
      return pId !== passageiroId;
    }) as [string];
    await viagemIsValid.save();

    return `Remoção bem-sucedida!`;
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
  }
};

export const addPassageiroToViagemById = async (
  viagemId: string,
  passageiroId: string
) => {
  try {
    const result = validateAdicionarPassageiroParaViagem({
      id: viagemId,
      passageiroId,
    });
    if (!result.success) return `${result.errors.toString()}`;
    const viagemIsValid = await viagemRepository.findOne({ id: viagemId });
    if (!viagemIsValid?.origem) return "A viagem não foi encontrada.";

    const passageiroValid = await usuarioRepository.findOne({
      id: passageiroId,
    });

    if (!passageiroValid?.nome) return "O passageiro não foi encontrado.";

    if (viagemIsValid.passageirosId.some((p) => p === passageiroId))
      return "O passageiro já está cadastrado a essa viagem.";
    passageiroValid.viagensId.push(viagemId);
    await passageiroValid.save();
    viagemIsValid.passageirosId.push(passageiroId);
    await viagemIsValid.save();

    return `Adição bem-sucedida!`;
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
  }
};

export const queryFindByMotoristaId = async (motoristaId: string) => {
  try {
    const motorista: any = await motoristaRepository.aggregate([
      {
        $match: {
          usuarioId: motoristaId,
        },
      },
      {
        $lookup: {
          from: `usuarios`,
          localField: "usuarioId",
          foreignField: "id",
          as: "usuario",
        },
      },
    ]);
    if (motorista.length === 0) return "ID de motorista inválido!";
    const motoristaResponse = padronizaMotorista(motorista[0]).data;
    const motoristaViagens = await viagemRepository.find({ motoristaId });
    return {
      ...motoristaResponse,
      viagens: motoristaViagens,
    };
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
  }
};

export const queryFindAllViagens = async () => {
  return await viagemRepository.find();
};

export const queryFindViagemById = async (id: string) => {
  const viagem = await viagemRepository.findOne({ id });
  return {
    viagem: viagem ? viagem : {},
    error: viagem ? "" : "Viagem não encontrada!",
  };
};
