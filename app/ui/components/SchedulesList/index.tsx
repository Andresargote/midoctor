import { Schedule } from '@/app/lib/types';
import { Settings } from 'luxon';

export type ShedulesListProps = {
	schedules: Schedule[];
};

Settings.defaultLocale = 'es';
export function SchedulesList({ schedules }: ShedulesListProps) {
	/*const orderByDate = (a: Schedule, b: Schedule) => {
		const aDate = DateTime.fromISO(a.date).set({
			hour: Number(a.time.split(':')[0]),
			minute: Number(a.time.split(':')[1]),
		});
		const bDate = DateTime.fromISO(b.date).set({
			hour: Number(b.time.split(':')[0]),
			minute: Number(b.time.split(':')[1]),
		});

		return aDate.toMillis() - bDate.toMillis();
	};*/

	//const sortedSchedules = schedules?.sort(orderByDate);

	return (
		<ol className="grid grid-cols-1 gap-6">
			<li className="bg-f-white rounded-lg">
				<div className="bg-neutral-200 p-4 rounded-t-lg">
					<time dateTime="" className="font-medium text-neutral-900">
						{}
					</time>
				</div>
				<div className="p-4 rounded-b-lg">
					<p className="text-sm font-light text-neutral-900"></p>
					<p className="text-sm font-light text-neutral-800"></p>
					<p className="text-sm font-light text-neutral-800"></p>
				</div>
			</li>
		</ol>
	);
}
