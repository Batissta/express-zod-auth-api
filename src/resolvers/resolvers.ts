import {
  findAllViagens,
  queryFindByMotoristaId,
  mutationUpdateById,
  createViagem,
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
  Mutation: {
    createViagem: async (_: any, { ...args }: any) => await createViagem(args),
    updateViagemById: async (_: any, { id, ...args }: any) =>
      await mutationUpdateById(id, args),
  },
};
