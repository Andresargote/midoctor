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

type ProfesionalScheduleData = {
	availabilityTimezone: string;
	serviceDuration: {
		hours: number;
		minutes: number;
	};
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

function checkScheduleCollision(
	startAt: DateTime,
	endAt: DateTime,
	schedules: ScheduleWithService[],
): boolean {
	// Base case - empty array
	if (schedules.length === 0) return false;

	const scheduleStartAt = DateTime.fromISO(
		schedules[0].professional_time.start_at,
	);

	const scheduleEndAt = DateTime.fromISO(schedules[0].professional_time.end_at);

	const START_BETWEEN_SCHEDULE =
		startAt >= scheduleStartAt && startAt <= scheduleEndAt;
	const END_BETWEEN_SCHEDULE =
		endAt >= scheduleStartAt && endAt <= scheduleEndAt;

	// Base case - collision found
	if (START_BETWEEN_SCHEDULE || END_BETWEEN_SCHEDULE) return true;

	// Recursive case - check the rest of the array
	return checkScheduleCollision(startAt, endAt, schedules.slice(1));
}

// TODO: Refactor this function, it's too long
// Extract database calls
// Better error handling
export async function createSchedule(
	schedule: CreateScheduleData,
	profesionalSchedule: ProfesionalScheduleData,
) {
	try {
		const supabase = createClient();

		let professionalStartAt: DateTime;
		let professionalEndAt: DateTime;

		let clientStartAt: DateTime;
		let clientEndAt: DateTime;

		console.log(profesionalSchedule, 'profesionalSchedule');
		console.log(schedule, 'schedule');

		if (profesionalSchedule.availabilityTimezone === schedule.timezone) {
			const startAt = buildDateTime(
				schedule.date,
				schedule.time,
				schedule.timezone,
			);

			professionalStartAt = startAt;
			professionalEndAt = startAt.plus(profesionalSchedule.serviceDuration);

			clientStartAt = startAt;
			clientEndAt = startAt.plus(profesionalSchedule.serviceDuration);
		} else {
			let startAt = buildDateTime(
				schedule.date,
				schedule.time,
				schedule.timezone,
			);

			clientStartAt = startAt;
			clientEndAt = startAt.plus(profesionalSchedule.serviceDuration);

			professionalStartAt = startAt.setZone(
				profesionalSchedule.availabilityTimezone,
			);
			professionalEndAt = startAt
				.setZone(profesionalSchedule.availabilityTimezone)
				.plus(profesionalSchedule.serviceDuration);
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

		console.log(maybeSchedules, 'schedules');

		// TODO: REMOVE THIS FROM THE ACTION FUNCTION
		if (maybeSchedules.data && maybeSchedules.data.length > 0) {
			// check if there is a collision in the schedules (Incomplete)
			alreadyBooked = checkScheduleCollision(
				professionalStartAt,
				professionalEndAt,
				maybeSchedules.data as ScheduleWithService[],
			);
		}

		console.log(alreadyBooked, 'alreadyBooked');

		if (alreadyBooked) {
			return {
				error: true,
				type: 'reserved',
			};
		}

		const scheduleData = {
			professional_id: schedule.profesional_id,
			service_id: schedule.service_id,
			availability_id: schedule.availability_id,
			consult_id: schedule.consult_id,
			name: schedule.name,
			email: schedule.email,
			comment: schedule.comment,
			professional_date: professionalStartAt.toISODate(),
			professional_time: {
				start_at: professionalStartAt.toISO(),
				end_at: professionalEndAt.toISO(),
				timezone: profesionalSchedule.availabilityTimezone,
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
