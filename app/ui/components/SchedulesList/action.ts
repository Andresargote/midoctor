'use server';
import { ScheduleStatus } from '@/app/lib/scheduleStatus';
import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { resend } from '@/app/lib/utils/resend';
import { createClient } from '@/app/lib/utils/supabase/server';
import { DoctorCanceledSchedule } from '../EmailTemplates/DoctorCanceledSchedule';
import { DateTime } from 'luxon';
//import { revalidatePath } from 'next/cache';

async function sendCancelEmailToClient(scheduleId: number) {
	const supabase = await createClient();

	const { error, data } = await supabase
		.from(SUPABASE_TABLES.SCHEDULES)
		.select('*')
		.eq('id', scheduleId)
		.maybeSingle();

	if (error) {
		console.log(error);
	}

	const clientTime = DateTime.fromISO(data.client_time.start_at);

	const result = await resend.emails.send({
		from: 'MiDoctor <info@midoctor.io>',
		to: [data.email],
		subject: 'MiDoctor - Tu cita ha sido cancelada',
		react: DoctorCanceledSchedule({
			name: data.name,
			startAt: clientTime,
		}),
	});

	if (result.error) {
		console.log(result.error);
	}
}

export async function cancelScheduleAction(scheduleId: number) {
	const supabase = await createClient();

	const { error } = await supabase
		.from(SUPABASE_TABLES.SCHEDULES)
		.update({
			status: ScheduleStatus.CANCELLED,
		})
		.match({ id: scheduleId });

	//revalidatePath('/app/mis-citas-reservadas', 'page');

	await sendCancelEmailToClient(scheduleId);

	return { error: !!error };
}

export async function completeScheduleAction(scheduleId: number) {
	const supabase = await createClient();

	const { error } = await supabase
		.from(SUPABASE_TABLES.SCHEDULES)
		.update({
			status: ScheduleStatus.COMPLETED,
		})
		.match({ id: scheduleId });

	return { error: !!error };
}
