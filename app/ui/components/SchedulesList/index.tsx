import { Schedule } from '@/app/lib/types';
import { DateTime } from 'luxon';

export type ShedulesListProps = {
	schedules: Schedule[];
};

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

	return (
		<ol>
			<li>1</li>
		</ol>
	);
}
