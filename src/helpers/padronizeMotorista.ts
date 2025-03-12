import { veiculoSchema } from "../schema/MotoristaZod";
import { schemaUserPadronized } from "./padronizeUsuario";
import { z } from "zod";

export const motoristaRequestSchema = z.object({
  usuarioId: z.string().startsWith("u."),
  usuario: z.array(schemaUserPadronized),
  veiculo: veiculoSchema,
});

export const motoristaResponseSchema = motoristaRequestSchema.transform(
  (data) => ({
    id: data.usuarioId,
    nome: data.usuario[0].nome,
    email: data.usuario[0].email,
    tipo: data.usuario[0].tipo,
    viagensId: data.usuario[0].viagensId,
    avaliacoesId: data.usuario[0].avaliacoesId,
    veiculo: data.veiculo,
  })
);

export const padronizaMotorista = (payload: TypeMotoristaNaoPadronizado) => {
  const result = motoristaResponseSchema.safeParse(payload);
  if (!result.success)
    return {
      errors: result.error.errors.map((e) => e.message),
      ...result,
    };
  return result;
};

export const padronizaMotoristas = (payload: TypeMotoristaNaoPadronizado[]) => {
  const motoristasTransformados = payload.map((user) => {
    return motoristaResponseSchema.safeParse(user).data;
  });
  console.log(motoristasTransformados);

  return motoristasTransformados;
};

export type TypeMotoristaNaoPadronizado = z.infer<
  typeof motoristaRequestSchema
>;
export type TypeMotoristaPadronizado = z.infer<typeof motoristaResponseSchema>;
