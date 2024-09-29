import { z } from 'zod';
import dayjs, { Dayjs } from 'dayjs';

export const clientSchema = z.object({
	service: z.string().min(1, {
		message: 'Selecciona un servicio',
	}),
	day: z.custom<Dayjs>(val => dayjs.isDayjs(val), {
		message: 'Selecciona un día',
	}),
	hour: z.string().min(1, {
		message: 'Selecciona un horario',
	}),
	name: z.string().min(1, {
		message: 'Introduce tu nombre',
	}),
	email: z.string().email({
		message: 'Introduce un email válido',
	}),
	comment: z.string().optional(),
});
