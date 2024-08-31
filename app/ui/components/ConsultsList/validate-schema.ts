import { z } from "zod";

export const consultSchema = (isOnline: boolean) => {
	return z.object({
		is_online: z.boolean(),
		name: z.string().min(1, {
			message: "Introduce el nombre de tu consultorio",
		}),
		address: isOnline
			? z.string().optional()
			: z
					.string({
						message: "Introduce una dirección para tu consultorio",
					})
					.min(1, {
						message: "Introduce una dirección para tu consultorio",
					}),
		phone_number: z
			.string({
				message: "Introduce un número de teléfono",
			})
			.optional()
			.refine((value) => {
				if (!value) return true;
				const regex = /^(?:\+58|0058)?[-]?(?:2\d{2}|4\d{2})[-]?\d{7}$/;
				return regex.test(value);
			}, "Introduce un número de teléfono válido"),
	});
};
