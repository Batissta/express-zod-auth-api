import {
  queryFindAllViagens,
  queryFindByMotoristaId,
  queryFindViagemById,
  mutationUpdateById,
  mutationCreateViagem,
  mutationDeleteById,
  deletePassageiroFromViagemById,
  addPassageiroToViagemById,
} from "../controllers/controllerViagem";

type paramMotoristaViagens = {
  motoristaId: string;
};

export const resolvers = {
  Query: {
    motoristaViagens: async (_: any, { motoristaId }: paramMotoristaViagens) =>
      await queryFindByMotoristaId(motoristaId),

    findAllViagens: async () => await queryFindAllViagens(),

    findViagemById: async (_: any, { id }: { id: string }) =>
      await queryFindViagemById(id),
  },

  Mutation: {
    createViagem: async (_: any, { ...args }: any) =>
      await mutationCreateViagem(args),

    updateViagemById: async (_: any, { id, ...args }: any) =>
      await mutationUpdateById(id, args),

    deleteViagemById: async (_: any, { id }: { id: string }) =>
      await mutationDeleteById(id),

    deletePassageiroFromViagemById: async (
      _: any,
      { viagemId, passageiroId }: { viagemId: string; passageiroId: string }
    ) => await deletePassageiroFromViagemById(viagemId, passageiroId),

    addPassageiroToViagemById: async (
      _: any,
      { viagemId, passageiroId }: { viagemId: string; passageiroId: string }
    ) => await addPassageiroToViagemById(viagemId, passageiroId),
  },
};
