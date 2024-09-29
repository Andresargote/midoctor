import type { Appointment } from '../appointment';
import type { Exception } from '../exception';
import type { Schedule } from '../schedule';
import { Slot, SlotStatusOptions } from '../slot';
import { Time, addTime } from '../time';

type BuildAvailabilityData = {
	date: Date;
	schedule: Schedule;
	apointments: Appointment[];
	exceptions: Exception[];
};

export function buildAvailability(req: BuildAvailabilityData): Array<Slot> {
	const day = req.date.getDay();

	const slots: Slot[] = [];

	const scheduleDay = req.schedule.props.scheduleRules.find(r => r.day === day);

	if (!scheduleDay) {
		throw new Error('Not found');
	}

	if (scheduleDay.intervals.length < 1) {
		return [];
	}

	const standardInterval = Time.newTime({ hour: 0, minutes: 30 });

	for (const interval of scheduleDay.intervals) {
		let time: Time = interval.from;

		while (time.lessThan(interval.to)) {
			slots.push(new Slot({ status: SlotStatusOptions.Available, time }));

			time = addTime(time, standardInterval);
		}
	}

	//change hours aviability depending on exceptions and appointments
	for (const appointment of req.apointments) {
		const durationSlots = slots.filter(
			s =>
				s.time.isEqual(appointment.time) ||
				(s.time.greaterThan(appointment.time) &&
					s.time.lessThan(
						addTime(appointment.time, appointment.service.duration),
					)),
		);

		for (const s of durationSlots) {
			s.setStatus(SlotStatusOptions.Booked);
		}
	}

	return slots;
}
