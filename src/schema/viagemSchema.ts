import { z } from "zod";

const criarViagemSchema = z.object({
  motoristaId: z
    .string()
    .startsWith("u.", "Motorista com o formato de ID inválido"),
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
  origem: z.string(),
  destino: z.string(),
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

export type tCriarViagemSchema = z.infer<typeof criarViagemSchema>;
