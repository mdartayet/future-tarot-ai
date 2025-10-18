import { z } from 'zod';

export const userInputSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Nombre requerido")
    .max(50, "Nombre muy largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras permitidas"),
  question: z.string()
    .trim()
    .min(10, "Pregunta muy corta (mínimo 10 caracteres)")
    .max(500, "Pregunta muy larga (máximo 500 caracteres)"),
  focus: z.enum(["love", "career", "money"], {
    errorMap: () => ({ message: "Selecciona un enfoque válido" })
  })
});

export type UserInput = z.infer<typeof userInputSchema>;
