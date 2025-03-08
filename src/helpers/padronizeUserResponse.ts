import { z } from "zod";
import { veiculoSchema } from "../schema/MotoristaZod";

const schemaUserUnpadronized = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  tipo: z.string(),
  viagensId: z.array(z.string()),
  avaliacoesId: z.array(z.string()),
});
export type TSchemaUserUnpadronized = z.infer<typeof schemaUserUnpadronized>;

const schemaUserPadronized = schemaUserUnpadronized.transform((data) => ({
  nome: data.nome,
  email: data.email,
  tipo: data.tipo,
  viagensId: data.viagensId,
  avaliacoesId: data.avaliacoesId,
}));
3;

export const padronizaResponseUsers = (payload: TSchemaUserUnpadronized[]) => {
  const usuariosTransformados = payload.map((user) => {
    return schemaUserPadronized.safeParse(user).data;
  });
  return usuariosTransformados;
};

export const padronizaResponseUser = (payload: TSchemaUserUnpadronized) => {
  const result = schemaUserPadronized.safeParse(payload);
  if (!result.success)
    return {
      errors: result.error.errors.map((e) => e.message),
      ...result,
    };
  return result;
};

const esquemaMotoristaNaoPadronizado = z.object({
  usuario: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      email: z.string(),
      tipo: z.string(),
      viagensId: z.array(z.string()),
      avaliacoesId: z.array(z.string()),
    })
  ),
  autenticado: z.boolean(),
  veiculo: veiculoSchema,
});
export type TypeMotoristaNaoPadronizado = z.infer<
  typeof esquemaMotoristaNaoPadronizado
>;

const esquemaMotoristaPadronizado = esquemaMotoristaNaoPadronizado.transform(
  (data) => ({
    id: data.usuario[0].id,
    nome: data.usuario[0].nome,
    email: data.usuario[0].email,
    viagensId: data.usuario[0].viagensId,
    avaliacoesId: data.usuario[0].avaliacoesId,
    autenticado: data.autenticado,
    veiculo: data.veiculo,
  })
);

export const padronizeMotoristasResponse = (
  payload: TypeMotoristaNaoPadronizado[]
) => {
  const usuariosTransformados = payload.map((user) => {
    return esquemaMotoristaPadronizado.safeParse(user).data;
  });
  return usuariosTransformados;
};

export const padronizeMotoristaResponse = (
  payload: TypeMotoristaNaoPadronizado
) => {
  const result = schemaUserPadronized.safeParse(payload);
  if (!result.success)
    return {
      erros: result.error.errors.map((e) => e.message),
      ...result,
    };
  return result;
};
