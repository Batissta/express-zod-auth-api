import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Hora {
    horas: Int
    minutos: Int
  }

  type Veiculo {
    marca: String
    modelo: String
    placa: String
    cor: String
  }

  type Viagem {
    id: String
    motoristaId: String
    passageirosId: [String]
    data: String
    hora: Hora
    origem: String
    destino: String
    status: String
  }

  type ViagemResponse {
    origem: String
    destino: String
    status: String
    data: String
    hora: Hora
  }

  type responseMotoristaViagens {
    nome: String
    veiculo: Veiculo
    viagens: [ViagemResponse]
  }

  type Query {
    motoristaViagens(motoristaId: String): responseMotoristaViagens
    findAllViagens: [Viagem]
  }
`;
