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

  type MutationViagemResponse {
    viagem: Viagem
    error: String
    details: [String]
  }

  type Query {
    motoristaViagens(motoristaId: String!): responseMotoristaViagens
    findViagemById(id: String!): MutationViagemResponse
    findAllViagens: [Viagem]
  }

  type Mutation {
    updateViagemById(
      id: String!
      motoristaId: String
      passageirosId: [String]
      passageiroId: String
      data: String
      horas: Int
      minutos: Int
      origem: String
      destino: String
      status: String
    ): MutationViagemResponse!

    createViagem(
      motoristaId: String
      passageirosId: [String]
      data: String!
      horas: Int!
      minutos: Int!
      origem: String!
      destino: String!
      status: String!
    ): MutationViagemResponse!

    deleteViagemById(id: String): String
  }
`;
