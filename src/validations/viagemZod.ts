import { z } from "zod";

const criarViagemSchema = z.object({
  motoristaId: z
    .string()
    .startsWith("u.", "Motorista com o formato de ID inválido")
    .optional(),
  data: z.string().length(10, "A data deve estar nesse formato: dd-mm-aaaa"),
  hora: z.object({
    horas: z
      .number()
      .min(0, "A hora mínima é 0 que representa 00:00.")
      .max(23, "A hora máxima é 23 que representa 11PM."),
    minutos: z
      .number()
      .min(0, "O mínimo é 0 em minutos.")
      .max(59, "O máximo é 59 em minutos."),
  }),
  origem: z
    .string()
    .min(2, "A origem da viagem deve possuir no mínimo 2 caracteres")
    .max(50, "A origem da viagem deve possuir no máximo 50 caracteres"),
  destino: z
    .string()
    .min(2, "O destino da viagem deve possuir no mínimo 2 caracteres")
    .max(50, "O destino da viagem deve possuir no máximo 50 caracteres"),
});

const atualizarViagemSchema = z.object({
  id: z.string().startsWith("v.", "Viagem com id inválido!"),
  motoristaId: z
    .string()
    .startsWith("u.", "Motorista com o formato de ID inválido")
    .optional(),
  data: z
    .string()
    .length(10, "A data deve estar nesse formato: dd-mm-aaaa")
    .optional(),
  hora: z
    .object({
      horas: z
        .number()
        .min(0, "A hora mínima é 0 que representa 00:00.")
        .max(23, "A hora máxima é 23 que representa 11PM."),
      minutos: z
        .number()
        .min(0, "O mínimo é 0 em minutos.")
        .max(59, "O máximo é 59 em minutos."),
    })
    .optional(),
  horas: z
    .number()
    .min(0, "A hora mínima é 0 que representa 00:00.")
    .max(23, "A hora máxima é 23 que representa 11PM.")
    .optional(),
  minutos: z
    .number()
    .min(0, "O mínimo é 0 em minutos.")
    .max(59, "O máximo é 59 em minutos.")
    .optional(),
  origem: z.string().optional(),
  destino: z.string().optional(),
  status: z
    .string()
    .toLowerCase()
    .refine(
      (status) => ["pendente", "confirmada", "concluida"].includes(status),
      { message: "O status deve ser pendente, confirmada ou concluida." }
    ),
});

export const validateCriarViagem = (payload: unknown) => {
  const payloadIsValid = criarViagemSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export const validateAtualizarViagem = (payload: unknown) => {
  const payloadIsValid = atualizarViagemSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  if (payloadIsValid.data.horas)
    payloadIsValid.data.hora = {
      horas: payloadIsValid.data.horas,
      minutos: payloadIsValid.data.minutos ? payloadIsValid.data.minutos : 0,
    };
  return payloadIsValid;
};

export type tCriarViagemSchema = z.infer<typeof criarViagemSchema>;
export type tAtualizarViagemSchema = z.infer<typeof atualizarViagemSchema>;
