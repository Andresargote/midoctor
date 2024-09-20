import { z } from 'zod';

export const serviceSchema = z.object({
	name: z.string().min(1, {
		message: 'Introduce el nombre del servicio',
	}),
	price: z.string().refine(value => {
		if (!value) return true;
		const regex = /^\d+(\.\d{1,2})?$/;
		return regex.test(value);
	}, 'Introduce un precio válido'),
	duration: z.object({
		hours: z.string(),
		minutes: z.string(),
	}),
});
