import { z } from "zod";

export const CriarUsuarioZodSchema = z.object({
  id: z.string().uuid().readonly(),
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres!")
    .max(20, "O nome deve ter no máximo 20 caracteres!"),
  email: z.string().email("E-mail inválido!"),
  senha: z.string().min(4, "Sua senha deve conter pelo menos 4 caracteres!"),
});

export const AtualizarUsuarioZodSchema = z.object({
  id: z.string().uuid().readonly(),
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres!")
    .max(20, "O nome deve ter no máximo 20 caracteres!")
    .optional(),
  email: z.string().email("E-mail inválido!").optional(),
  senha: z
    .string()
    .min(4, "Sua senha deve conter pelo menos 4 caracteres!")
    .optional(),
});

export type TCriarUsuarioZodSchema = z.infer<typeof CriarUsuarioZodSchema>;
export type TAtualizarUsuarioZodSchema = z.infer<
  typeof AtualizarUsuarioZodSchema
>;
