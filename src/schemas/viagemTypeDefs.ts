import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Usuario {
    nome: String
  }

  type Hora {
    horas: Int
    minutos: Int
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

  type Query {
    motoristaViagens(motoristaId: String): String
    findAllViagens: [Viagem]
  }
`;
