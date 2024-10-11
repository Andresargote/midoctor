import { DateTime } from 'luxon';
import { Resend } from 'resend';

import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { createClient } from '@/app/lib/utils/supabase/server';
import { Schedule } from '@/app/lib/types';
import { ScheduleReminder } from '@/app/ui/components/EmailTemplates/ScheduleReminder';
import { ScheduleStatus } from '@/app/lib/scheduleStatus';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
	const supabase = createClient();

	const tomorrowISO = DateTime.fromJSDate(new Date()).toISODate();

	const { data, error } = await supabase
		.from(SUPABASE_TABLES.SCHEDULES)
		.select('*')
		.eq('professional_date', tomorrowISO);

	if (error) {
		return Response.json({ error: true, message: error.message });
	}

	const result = await resend.batch.send(
		(data as Schedule[])
			.filter(s => s.status === ScheduleStatus.SCHEDULED)
			.map(s => ({
				from: 'info@midoctor.io',
				to: [s.email],
				subject: 'Recordatorio: Tu consulta en MiDoctor',
				react: ScheduleReminder({
					name: s.name,
					startAt: DateTime.fromISO(s.professional_date),
				}),
			})),
	);

	console.log(result.error, result.data, 'RESULT RESEND');

	return Response.json({ error: false, message: 'Schedules reminders sent' });
}
