import {
  findAllViagens,
  queryFindByMotoristaId,
} from "../controllers/controllerViagem";

type paramMotoristaViagens = {
  motoristaId: string;
};

export const resolvers = {
  Query: {
    motoristaViagens: async (_: any, { motoristaId }: paramMotoristaViagens) =>
      await queryFindByMotoristaId(motoristaId),
    findAllViagens: async () => await findAllViagens(),
  },
};
