import { Schedule } from '@/app/lib/types';
import { DateTime, Settings } from 'luxon';

export type ShedulesListProps = {
	schedules: Schedule[];
};

Settings.defaultLocale = 'es';
export function SchedulesList({ schedules }: ShedulesListProps) {
	const orderByDate = (a: Schedule, b: Schedule) => {
		const aDate = DateTime.fromISO(a.date).set({
			hour: Number(a.time.split(':')[0]),
			minute: Number(a.time.split(':')[1]),
		});
		const bDate = DateTime.fromISO(b.date).set({
			hour: Number(b.time.split(':')[0]),
			minute: Number(b.time.split(':')[1]),
		});

		return aDate.toMillis() - bDate.toMillis();
	};

	const sortedSchedules = schedules?.sort(orderByDate);

	const schedulesWithIsPast = sortedSchedules?.map(schedule => {
		const formattedDate = DateTime.fromISO(schedule.date)
			.set({
				hour: Number(schedule.time.split(':')[0]),
				minute: Number(schedule.time.split(':')[1]),
			})
			.setZone(schedule.timezone)
			.plus({
				hours: schedule.service?.duration.hours,
				minutes: schedule.service?.duration.minutes,
			});

		const isPast =
			DateTime.now().setZone(schedule.timezone).toMillis() >
			formattedDate.toMillis();

		return {
			...schedule,
			isPast,
		};
	});

	const date = (
		date: string,
		time: string,
		userTimezone: string,
		timezone: string,
	) => {
		const formattedDate = DateTime.fromISO(date)
			.set({
				hour: Number(time.split(':')[0]),
				minute: Number(time.split(':')[1]),
			})
			.setZone(userTimezone);
		const profesionalDate = formattedDate.setZone(timezone);
		return profesionalDate.toLocaleString(DateTime.DATE_HUGE);
	};

	const dateTime = (date: string, time: string) => {
		return DateTime.fromISO(date)
			.set({
				hour: Number(time.split(':')[0]),
				minute: Number(time.split(':')[1]),
			})
			.toLocaleString(DateTime.DATETIME_MED);
	};

	return (
		<ol className="grid grid-cols-1 gap-6">
			{schedulesWithIsPast?.map(schedule => (
				<li key={schedule.id} className="bg-f-white rounded-lg">
					<div className="bg-neutral-200 p-4 rounded-t-lg">
						<time
							dateTime={dateTime(schedule.date, schedule.time)}
							className="font-medium text-neutral-900"
						>
							{date(
								schedule.date,
								schedule.time,
								schedule.timezone,
								schedule.availability.timezone,
							)}
						</time>
					</div>
					<div className="p-4 rounded-b-lg">
						<p className="text-sm font-light text-neutral-900">
							{schedule.name}
						</p>
						<p className="text-sm font-light text-neutral-800">
							{schedule.service?.name}
						</p>
						<p className="text-sm font-light text-neutral-800">
							{schedule.comment}
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}
