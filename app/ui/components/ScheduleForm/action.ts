'use server';

import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { Availability, Service } from '@/app/lib/types';
import { ScheduleWithService } from '@/app/lib/types/schedule';
import { createClient } from '@/app/lib/utils/supabase/server';
import { DateTime } from 'luxon';

type CreateScheduleData = {
	service_id: string;
	availability_id: string;
	profesional_id: string;
	consult_id: string;
	date: string;
	time: string; // Client time
	name: string;
	email: string;
	comment: string;
	timezone: string; // Client timezone
};

/*{
  service_id: 'e07dce48-25c4-4f3e-8f43-a8f2480f7cfc',
  date: '2024-10-02',
  time: '12:00',
  name: 'Andre',
  email: 'aizarra2015@gmail.com',
  comment: 'Comments',
  availability_id: 1,
  profesional_id: 'ade57abe-ea6d-471d-8026-557c461c0994',
  timezone: 'America/Caracas',
  consult_id: 10
} Schedule*/

function dateStringToDateTime(date: string): DateTime {
	return DateTime.fromISO(date);
}

function timeToHourAndMinutes(time: string): {
	hours: number;
	minutes: number;
} {
	const [hours, minutes] = time.split(':');
	return {
		hours: Number(hours),
		minutes: Number(minutes),
	};
}

function buildDateTime(date: string, time: string, timezone: string): DateTime {
	return dateStringToDateTime(date)
		.setZone(timezone)
		.plus(timeToHourAndMinutes(time));
}

// TODO: Refactor this function, it's too long
// Extract schedule calculations to a separate function
// Extract database calls
// Better error handling
export async function createSchedule(schedule: CreateScheduleData) {
	try {
		const supabase = createClient();

		const maybeAvailability = await supabase
			.from(SUPABASE_TABLES.AVIABILITY)
			.select('*')
			.eq('id', schedule.availability_id);

		const maybeService = await supabase
			.from(SUPABASE_TABLES.SERVICES)
			.select('*')
			.eq('service_id', schedule.service_id);

		if (!maybeService.data || maybeService.data?.length === 0) {
			throw new Error('No se encontró el servicio');
		}

		if (!maybeAvailability.data || maybeAvailability.data?.length === 0) {
			throw new Error('No se encontró la disponibilidad');
		}

		const service: Service = maybeService.data[0];
		const availability: Availability = maybeAvailability?.data[0];

		let professionalStartAt: DateTime;
		let professionalEndAt: DateTime;

		let clientStartAt: DateTime;
		let clientEndAt: DateTime;

		if (availability.timezone === schedule.timezone) {
			const startAt = buildDateTime(
				schedule.date,
				schedule.time,
				schedule.timezone,
			);

			professionalStartAt = startAt;
			professionalEndAt = startAt.plus(service.duration);

			clientStartAt = startAt;
			clientEndAt = startAt.plus(service.duration);
		} else {
			let startAt = buildDateTime(
				schedule.date,
				schedule.time,
				schedule.timezone,
			);

			clientStartAt = startAt;
			clientEndAt = startAt.plus(service.duration);

			professionalStartAt = startAt.setZone(availability.timezone);
			professionalEndAt = startAt
				.setZone(availability.timezone)
				.plus(service.duration);
		}

		const maybeSchedules = await supabase
			.from(SUPABASE_TABLES.SCHEDULES)
			.select(
				`
					*,
					service:service_id(*)
				`,
			)
			.eq('professional_date', professionalStartAt.toISODate());

		let alreadyBooked = false;
		if (maybeSchedules.data && maybeSchedules.data.length > 0) {
			// check if there is a collision in the schedules (Incomplete)
			for (const schedule of maybeSchedules.data as ScheduleWithService[]) {
				const scheduleStartAt = DateTime.fromISO(
					schedule.professional_time.start_at,
				);

				const scheduleEndAt = DateTime.fromISO(
					schedule.professional_time.end_at,
				);

				const START_BETWEEN_SCHEDULE =
					professionalStartAt > scheduleStartAt &&
					professionalStartAt < scheduleEndAt;
				const END_BETWEEN_SCHEDULE =
					professionalEndAt > scheduleStartAt &&
					professionalEndAt < scheduleEndAt;

				if (START_BETWEEN_SCHEDULE || END_BETWEEN_SCHEDULE) {
					alreadyBooked = true;
				}
			}
		}

		if (alreadyBooked) {
			return {
				error: true,
				type: 'already booked',
			};
		}

		const scheduleData = {
			professional_id: schedule.profesional_id,
			service_id: schedule.service_id,
			name: schedule.name,
			email: schedule.email,
			comment: schedule.comment,
			professional_date: professionalStartAt.toISODate(),
			professional_time: {
				start_at: professionalStartAt.toISO(),
				end_at: professionalEndAt.toISO(),
				timezone: availability.timezone,
			},
			client_time: {
				start_at: clientStartAt.toISO(),
				end_at: clientEndAt.toISO(),
				timezone: schedule.timezone,
			},
		};

		const { error } = await supabase
			.from(SUPABASE_TABLES.SCHEDULES)
			.insert(scheduleData);

		if (error) {
			return {
				error: true,
				type: 'error',
			};
		}

		return {
			error: false,
			type: 'success',
		};
	} catch (error) {
		console.log(error);
		return {
			error: true,
			type: 'error',
		};
	}
}
