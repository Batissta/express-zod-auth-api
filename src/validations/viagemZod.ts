import { z } from "zod";

const criarViagemSchema = z.object({
  motoristaId: z
    .string()
    .startsWith("u.", "Motorista com o formato de ID inválido")
    .optional(),
  passageirosId: z
    .array(
      z.string().startsWith("u.", "Passageiro com o formato de ID inválido")
    )
    .optional(),
  data: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: "Formato inválido. Utilize o formato dd/mm/aaaa",
    })
    .refine(
      (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        const data = new Date();
        const date = new Date(year, month - 1, day, 23, 59, 59);
        return (
          data.getTime() <= date.getTime() &&
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        );
      },
      {
        message: "A data informada está inválida!",
      }
    ),
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
  origem: z
    .string()
    .min(2, "A origem da viagem deve possuir no mínimo 2 caracteres")
    .max(100, "A origem da viagem deve possuir no máximo 100 caracteres"),
  destino: z
    .string()
    .min(2, "O destino da viagem deve possuir no mínimo 2 caracteres")
    .max(100, "O destino da viagem deve possuir no máximo 100 caracteres"),
});

const atualizarViagemSchema = z.object({
  id: z.string().startsWith("v.", "Viagem com id inválido!"),
  motoristaId: z
    .string()
    .startsWith("u.", "Motorista com o formato de ID inválido")
    .optional(),
  data: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: "Formato inválido. Utilize o formato dd/mm/aaaa",
    })
    .refine(
      (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        const data = new Date();
        const date = new Date(year, month - 1, day, 23, 59, 59);
        return (
          data.getTime() <= date.getTime() &&
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        );
      },
      {
        message: "A data informada está inválida!",
      }
    )
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
  passageirosId: z
    .array(z.string().startsWith("u.", "Passageiro com id inválido!"))
    .optional(),
  passageiroId: z
    .string()
    .startsWith("u.", "Passageiro com id inválido!")
    .optional(),
  origem: z.string().optional(),
  destino: z.string().optional(),
  status: z
    .string()
    .toLowerCase()
    .refine(
      (status) => ["pendente", "confirmada", "concluida"].includes(status),
      { message: "O status deve ser pendente, confirmada ou concluida." }
    )
    .optional(),
});

const adicionarPassageiroParaViagemSchema = z.object({
  id: z.string().startsWith("v.", "Viagem com id inválido!"),
  passageiroId: z.string().startsWith("u.", "Passageiro com id inválido!"),
});

export const validateCriarViagem = (payload: unknown) => {
  const payloadIsValid = criarViagemSchema.safeParse(payload);
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

export const validateAdicionarPassageiroParaViagem = (payload: unknown) => {
  const payloadIsValid = adicionarPassageiroParaViagemSchema.safeParse(payload);
  if (!payloadIsValid.success)
    return {
      errors: payloadIsValid.error.errors.map((e) => e.message),
      ...payloadIsValid,
    };
  return payloadIsValid;
};

export type tCriarViagemSchema = z.infer<typeof criarViagemSchema>;
export type tAtualizarViagemSchema = z.infer<typeof atualizarViagemSchema>;
