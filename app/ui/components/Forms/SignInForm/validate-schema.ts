import { z } from "zod";

export const signInSchema = z.object({
	email: z
		.string()
		.min(1, {
			message: "Introduce un email es requerido",
		})
		.email({
			message: 'Introduce un email válido (ej. "hola@ejemplo.com")',
		})
		.endsWith(".com", {
			message: 'Introduce un email válido (ej. "hola@ejemplo.com")',
		}),
});
