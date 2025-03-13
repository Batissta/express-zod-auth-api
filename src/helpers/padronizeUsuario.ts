import { z } from "zod";
import { veiculoSchema } from "../validations/motoristaZod";

export const schemaUserPadronized = z.object({
  nome: z.string(),
  email: z.string(),
  tipo: z.string(),
  viagensId: z.array(z.string()),
  avaliacoesId: z.array(z.string()),
});
export type TSchemaUserUnpadronized = z.infer<typeof schemaUserPadronized>;

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
