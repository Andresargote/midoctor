import { DateTime } from 'luxon';
import { Day, Slot } from '../types';

export function generateHoursAndMinutes(
	startTime: string,
	endTime: string,
	interval: number,
) {
	// Convierte el tiempo en minutos desde medianoche
	function timeToMinutes(time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}
	// Convierte minutos a formato de tiempo 'HH:MM'
	function minutesToTime(minutes: number) {
		const hours = Math.floor(minutes / 60)
			.toString()
			.padStart(2, '0');
		const mins = (minutes % 60).toString().padStart(2, '0');
		return `${hours}:${mins}`;
	}

	const startMinutes = timeToMinutes(startTime);
	const endMinutes = timeToMinutes(endTime);
	const hoursAndMinutes = [];

	// endMinutes es medianoche
	if (endMinutes < startMinutes) {
		// Agregar horas desde startMinutes hasta 1440 (medianoche)
		for (let minutes = startMinutes; minutes < 1440; minutes += interval) {
			hoursAndMinutes.push(minutesToTime(minutes));
		}

		// Agregar horas desde 0 hasta endMinutes
		for (let minutes = 0; minutes <= endMinutes; minutes += interval) {
			hoursAndMinutes.push(minutesToTime(minutes));
		}
	} else {
		for (
			let minutes = startMinutes;
			minutes <= endMinutes;
			minutes += interval
		) {
			hoursAndMinutes.push(minutesToTime(minutes));
		}
	}

	//hoursAndMinutes.push('23:59');

	return hoursAndMinutes;
}

export function generateSlotTimes(
	slot: Slot,
	dayDate: luxon.DateTime,
	timezone: string,
) {
	const startHour = Number(slot.start.split(':')[0]);
	const startMinute = Number(slot.start.split(':')[1]);

	const endHour = Number(slot.end.split(':')[0]);
	const endMinute = Number(slot.end.split(':')[1]);

	const startAt = dayDate
		.set({
			hour: startHour,
			minute: startMinute,
		})
		.setZone(timezone);

	const endAt = dayDate
		.set({
			hour: endHour,
			minute: endMinute,
		})
		.setZone(timezone);

	return {
		startAt,
		endAt,
	};
}

export function convertMinutesInHoursAndMinutes(intervalMinutes: number) {
	const hours = Math.floor(intervalMinutes / 60);
	const minutes = intervalMinutes % 60;
	return [hours, minutes];
}

export function generateWeekDays(startWeekDate: luxon.DateTime) {
	const days = [];
	for (let i = 0; i < 7; i++) {
		days.push(startWeekDate.plus({ days: i }));
	}
	return days;
}

export function setHoursInWeekDays(
	weekDays: luxon.DateTime[],
	hours: luxon.DateTime[],
) {
	const weekDaysWithHours = weekDays.map(weekDay => {
		const dayHours = hours.filter(
			hour => hour.toFormat('yyyy-MM-dd') === weekDay.toFormat('yyyy-MM-dd'),
		);

		return {
			day: weekDay,
			hours: dayHours,
			available: true,
		};
	});

	return weekDaysWithHours;
}

export function setIsAvailableInWeekDays(
	weekDaysWithHours: { day: luxon.DateTime; hours: luxon.DateTime[] }[],
	availabilityDays: Day[],
) {
	const weekDaysWithHoursAndIsAvailable = weekDaysWithHours.map(weekDay => {
		const availabilityDay = availabilityDays.find(
			day => day.idDay === weekDay.day.weekday,
		);

		const isAvailable = isWeekDayAvailable(
			weekDay,
			availabilityDay?.available ?? false,
		);

		return {
			...weekDay,
			available: isAvailable,
		};
	});

	return weekDaysWithHoursAndIsAvailable;
}

export function isWeekDayAvailable(
	day: { day: luxon.DateTime; hours: luxon.DateTime[] },
	availability: boolean,
) {
	const dt = DateTime.now();
	const today = dt
		.setZone(day.day.zoneName ?? 'America/Caracas')
		.startOf('day');

	if (day.day.startOf('day') < today) {
		return false;
	} else {
		if (day.hours.length > 0) {
			return true;
		}

		return availability;
	}
}

export function getDefaultTimezones(
	validTimezones: { value: string; label: string }[],
	defaultTimezone?: string,
) {
	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const timezone = validTimezones.find(tz => tz.value === userTimezone)?.value;

	return timezone ?? defaultTimezone;
}

export function isCurrentWeek(currentWeekStart: DateTime) {
	const today = DateTime.now();

	return currentWeekStart.weekNumber === today.weekNumber;
}
