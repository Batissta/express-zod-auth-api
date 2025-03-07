import { z } from "zod";

export const CriarPassageiroSchema = z.object({
  usuarioId: z
    .string()
    .nonempty()
    .startsWith("u.", "O ID de usuário está em um formato inválido!"),
});

export const AtualizarInformacoesSchema = z.object({
  usuarioId: z
    .string()
    .nonempty()
    .startsWith("u.", "O ID de usuário está em um formato inválido!"),
  viagemId: z
    .string()
    .startsWith("v.", "O ID da viagem está em um formato incorreto!")
    .optional(),
  avaliacaoId: z
    .string()
    .startsWith("a.", "O ID da viagem está em um formato incorreto!")
    .optional(),
});

export const validateCriarPayload = (payload: unknown) => {
  const payloadIsValid = CriarPassageiroSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export const validateAtualizarPayload = (payload: unknown) => {
  const payloadIsValid = AtualizarInformacoesSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export type TCriarPassageiroZodSchema = z.infer<typeof CriarPassageiroSchema>;
export type TAtualizarPassageiroZodSchema = z.infer<
  typeof AtualizarInformacoesSchema
>;
