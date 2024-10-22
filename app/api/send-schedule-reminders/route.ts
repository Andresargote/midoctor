import { DateTime } from 'luxon';

import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { createClient } from '@/app/lib/utils/supabase/server';
import { ScheduleReminder } from '@/app/ui/components/EmailTemplates/ScheduleReminder';
import { ScheduleStatus } from '@/app/lib/scheduleStatus';
import { resend } from '@/app/lib/utils/resend';

export async function GET() {
	const supabase = createClient();

	//todo: Add 1 day
	const tomorrowISO = DateTime.fromJSDate(new Date()).toISODate();

	const { data, error } = await supabase
		.from(SUPABASE_TABLES.SCHEDULES)
		.select(
			`
				status, 
				email,
				name,
				professional_date,
				client_time,
				service:service_id (name),
				consult:consult_id (address, phone_number),
				profile:professional_id (full_name)
			`,
		)
		.eq('professional_date', tomorrowISO);

	if (error) {
		return Response.json({ error: true, message: error.message });
	}

	const result = await resend.batch.send(
		(data as any[])
			.filter(s => s.status === ScheduleStatus.SCHEDULED)
			.map(s => ({
				from: 'info@midoctor.io',
				to: [s.email],
				subject: 'Recordatorio: Tu próxima consulta está cerca',
				react: ScheduleReminder({
					name: s.name,
					professionalName: s?.profile?.full_name,
					address: s?.consult?.address,
					phoneNumber: s?.consult?.phone_number,
					serviceName: s?.service?.name,
					startAt: DateTime.fromISO(s?.client_time?.start_at),
				}),
			})),
	);

	console.log(result.error, result.data, 'RESULT RESEND');

	return Response.json({ error: false, message: 'Schedules reminders sent' });
}
