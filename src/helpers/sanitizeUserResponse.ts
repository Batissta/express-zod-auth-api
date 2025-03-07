import { z } from "zod";

export type TUserUnsanitized = {
  usuarios: {
    id: string;
    nome: string;
    email: string;
    senha: string;
    tipo: string;
    info: {
      usuarioId: string;
      viagens: [string];
      avaliacoes: [string];
    };
  };
};

type TUserSanitized = {
  nome: string;
  email: string;
  tipo: string;
  viagens: [string];
  avaliacoes: [string];
};

const schemaUserUnpadronized = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  tipo: z.string(),
  info: z.array(
    z.object({
      usuarioId: z.string(),
      viagens: z.array(z.string()),
      avaliacoes: z.array(z.string()),
    })
  ),
});

const schemaUserPadronized = schemaUserUnpadronized.transform((data) => ({
  nome: data.nome,
  email: data.email,
  tipo: data.tipo,
  viagens: data.info[0].viagens,
  avaliacoes: data.info[0].viagens,
}));

export const padronizaResponseUsers = (payload: TUserUnsanitized[]) => {
  const usuariosTransformados = payload.map((user: any) => {
    return schemaUserPadronized.safeParse(user).data;
  });
  return usuariosTransformados;
};
