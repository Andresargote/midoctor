'use server';

import { createClient } from '@/app/lib/utils/supabase/server';

type Schedule = {
	service_id: string;
	date: string;
	time: string;
	name: string;
	email: string;
	comment: string;
	timezone: string;
	availability_id: string;
	profesional_id: string;
};

export async function createSchedule(schedule: Schedule) {
	try {
		console.log(schedule);
		const supabase = createClient();

		// TODO: verificar que la disponibilidad existe

		const { error } = await supabase.from('schedules').insert(schedule);

		if (error) {
			return {
				error: true,
				type: 'error',
			};
		}

		// TODO: si la cita se reserva, debemos de enviar notificaciones al profesional y al usuario

		return {
			error: false,
			type: 'success',
		};
	} catch (error) {
		return {
			error: true,
			type: 'error',
		};
	}
}
