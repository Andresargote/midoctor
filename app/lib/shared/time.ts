import { DateTime } from 'luxon';
import { ScheduleWithService } from '../types/schedule';

export function timeToHourAndMinutes(time: string): {
	hours: number;
	minutes: number;
} {
	const [hours, minutes] = time.split(':');
	return {
		hours: Number(hours),
		minutes: Number(minutes),
	};
}

export function mapDateTimeToString(dateTime: DateTime): string {
	return `${dateTime.year}-${dateTime.month}-${dateTime.day} ${dateTime.hour}:${dateTime.minute}`;
}

export function dateStringToDateObject(date: string): {
	year: number;
	month: number;
	day: number;
} {
	const [year, month, day] = date.split('-').map(Number);
	return {
		year,
		month,
		day,
	};
}

export function buildDateTime(
	date: string,
	time: string,
	timezone: string,
): DateTime {
	const { year, month, day } = dateStringToDateObject(date);
	const { hours, minutes } = timeToHourAndMinutes(time);
	return DateTime.fromObject(
		{
			year,
			month,
			day,
			hour: hours,
			minute: minutes,
			second: 0,
			millisecond: 0,
		},
		{ zone: timezone },
	);
}

export function checkScheduleCollision(
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
