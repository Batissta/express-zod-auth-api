import { z } from "zod";

export const veiculoSchema = z.object({
  marca: z
    .string()
    .min(2, "A marca não pode ter menos que 2 caracteres!")
    .max(25, "A marca não pode ter mais que 25 caracteres!"),
  modelo: z
    .string()
    .min(2, "O modelo não pode ter menos que 2 caracteres!")
    .max(30, "O modelo não pode ter mais que 30 caracteres!"),
  ano: z.number().min(2000, "O seu veículo deve ser no mínimo do ano 2000."),
  placa: z
    .string()
    .trim()
    .length(7, "A placa do seu veículo deve ter 7 caracteres.")
    .toUpperCase(),
  cor: z
    .string()
    .min(2, "A cor não pode ter menos que 2 caracteres!")
    .max(25, "A cor não pode ter mais que 25 caracteres!"),
});

export const atualizarVeiculoSchema = z.object({
  marca: z
    .string()
    .min(2, "A marca não pode ter menos que 2 caracteres!")
    .max(25, "A marca não pode ter mais que 25 caracteres!")
    .optional(),
  modelo: z
    .string()
    .min(2, "O modelo não pode ter menos que 2 caracteres!")
    .max(30, "O modelo não pode ter mais que 30 caracteres!")
    .optional(),
  ano: z
    .number()
    .min(1995, "O seu veículo deve ser no mínimo do ano 1995.")
    .optional(),
  placa: z
    .string()
    .trim()
    .length(7, "A placa do seu veículo deve ter 7 caracteres.")
    .toUpperCase()
    .optional(),
  cor: z
    .string()
    .min(2, "A cor não pode ter menos que 2 caracteres!")
    .max(25, "A cor não pode ter mais que 25 caracteres!")
    .optional(),
});

export const criarMotoristaSchema = z.object({
  usuarioId: z
    .string()
    .startsWith("u.", "O id informado está em um formato inválido!"),
  veiculo: veiculoSchema,
});

export const atualizarMotoristaSchema = z.object({
  veiculo: atualizarVeiculoSchema.optional(),
  autenticado: z.boolean().optional(),
});

export type TVeiculoSchema = z.infer<typeof veiculoSchema>;

export const validateVeiculoSchema = (payload: TVeiculoSchema) => {
  const result = veiculoSchema.safeParse(payload);
  if (!result.success)
    return {
      errors: result.error.errors.map((e) => e.message),
      ...result,
    };
  return result;
};

export type TCriarMotoristaSchema = z.infer<typeof criarMotoristaSchema>;

export const validateCriarMotoristaSchema = (
  payload: TCriarMotoristaSchema
) => {
  const result = criarMotoristaSchema.safeParse(payload);
  if (!result.success)
    return {
      errors: result.error.errors.map((e) => e.message),
      ...result,
    };
  return result;
};

export type TAtualizarMotoristaSchema = z.infer<
  typeof atualizarMotoristaSchema
>;

export const validateAtualizarSchema = (payload: TAtualizarMotoristaSchema) => {
  const result = atualizarMotoristaSchema.safeParse(payload);
  if (!result.success)
    return {
      errors: result.error.errors.map((e) => e.message),
      ...result,
    };
  return result;
};
