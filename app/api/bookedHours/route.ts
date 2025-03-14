import { createClient } from '@/app/lib/utils/supabase/server';
import { DateTime } from 'luxon';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl;
		const { startAt, endAt, timezone } = Object.fromEntries(
			searchParams.entries(),
		);

		const formatedStartAt = DateTime.fromISO(startAt).toISODate();
		const formatedEndAt = DateTime.fromISO(endAt).toISODate();
		const supabase = await createClient();

		const { data, error } = await supabase
			.from('schedules')
			.select('*')
			.eq('is_canceled', false)
			.gte('professional_date', formatedStartAt)
			.lte('professional_date', formatedEndAt);

		if (error) {
			throw new Error('Failed to fetch booked hours');
		}

		const professionalBookedHours = data.map(schedule => {
			return {
				bookedDate: schedule.professional_date,
				bookedTime: {
					start_at: DateTime.fromISO(
						schedule.professional_time.start_at,
					).setZone(timezone),
					end_at: DateTime.fromISO(schedule.professional_time.end_at).setZone(
						timezone,
					),
				},
			};
		});

		return Response.json({
			bookedHours: professionalBookedHours,
		});
	} catch (error) {
		console.log(error, 'error');
		throw new Error('Failed to fetch booked hours');
	}
}
