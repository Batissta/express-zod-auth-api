import { z } from "zod";

export enum eUsuarioTipo {
  motorista = "motorista",
  passageiro = "passageiro",
}

export const CriarUsuarioZodSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres!")
    .max(20, "O nome deve ter no máximo 20 caracteres!"),
  email: z.string().trim().toLowerCase().email("E-mail inválido!"),
  senha: z.string().min(4, "Sua senha deve conter pelo menos 4 caracteres!"),
  tipo: z.nativeEnum(eUsuarioTipo),
});

export const AtualizarUsuarioZodSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres!")
    .max(20, "O nome deve ter no máximo 20 caracteres!")
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Formato de e-mail inválido!")
    .optional(),
  senha: z
    .string()
    .min(4, "Sua senha deve conter pelo menos 4 caracteres!")
    .optional(),
  tipo: z.nativeEnum(eUsuarioTipo).optional(),
  viagemId: z.string().startsWith("v.").optional(),
  avaliacaoId: z.string().startsWith("a.").optional(),
});

export const LoginUsuarioZodSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Formato de e-mail inválido!")
    .nonempty(),
  senha: z.string().nonempty(),
});

export const validateCriarPayload = (payload: unknown) => {
  const payloadIsValid = CriarUsuarioZodSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export const validateLoginPayload = (payload: unknown) => {
  const payloadIsValid = LoginUsuarioZodSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export const validateAtualizarPayload = (payload: unknown) => {
  const payloadIsValid = AtualizarUsuarioZodSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export type TCriarUsuarioZodSchema = z.infer<typeof CriarUsuarioZodSchema>;
export type TAtualizarUsuarioZodSchema = z.infer<
  typeof AtualizarUsuarioZodSchema
>;
export type TLoginUsuarioZodSchema = z.infer<typeof LoginUsuarioZodSchema>;
