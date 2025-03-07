import { z } from "zod";

export type TUserUnpadronized = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: string;
  viagensId: [string];
  avaliacoesId: [string];
};

const schemaUserUnpadronized = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  tipo: z.string(),
  viagensId: z.array(z.string()),
  avaliacoesId: z.array(z.string()),
});

const schemaUserPadronized = schemaUserUnpadronized.transform((data) => ({
  nome: data.nome,
  email: data.email,
  tipo: data.tipo,
  viagensId: data.viagensId,
  avaliacoesId: data.avaliacoesId,
}));

export const padronizaResponseUsers = (payload: TUserUnpadronized[]) => {
  const usuariosTransformados = payload.map((user: any) => {
    return schemaUserPadronized.safeParse(user).data;
  });
  return usuariosTransformados;
};

export const padronizaResponseUser = (payload: TUserUnpadronized) => {
  return schemaUserPadronized.safeParse(payload);
};
