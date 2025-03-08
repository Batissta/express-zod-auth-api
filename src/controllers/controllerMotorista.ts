import { padronizeMotoristasResponse } from "../helpers/padronizeUserResponse";
import MotoristaRepository from "../models/ModelMotorista";
import { validateCriarMotoristaSchema } from "../schema/MotoristaZod";

export const criarMotorista = async (req: any, res: any) => {
  try {
    const result = validateCriarMotoristaSchema(req.body);
    if (!result.success)
      res.status(400).json({
        erros: result.errors,
      });

    const motorista = await MotoristaRepository.create(result.data);

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      veiculo: {
        marca: motorista.veiculo.marca,
        modelo: motorista.veiculo.modelo,
        ano: motorista.veiculo.ano,
        cor: motorista.veiculo.cor,
        placa: motorista.veiculo.placa,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).json({
        mensage: error.message,
      });
  }
};

export const listarMotoristas = async (req: any, res: any) => {
  try {
    const usuarios = await MotoristaRepository.aggregate([
      {
        $lookup: {
          from: `usuarios`,
          localField: "usuarioId",
          foreignField: "id",
          as: "usuario",
        },
      },
    ]);
    if (!(usuarios.length > 0))
      return res.status(200).json({
        quantidade: usuarios.length,
        usuarios: [],
      });

    const usuariosResponse = padronizeMotoristasResponse(usuarios);

    return res.status(200).json({
      quantidade: usuariosResponse.length,
      usuarios: usuariosResponse,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(500).json({
        mensagem:
          "O servidor está enfrentando problemas. Entre em contato com o suporte!",
      });
  }
};
