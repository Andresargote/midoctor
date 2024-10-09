export const ScheduleStatus = {
	SCHEDULED: 0, // initial status
	CANCELLED: 1,
	COMPLETED: 2,
} as const;

type Keys = keyof typeof ScheduleStatus;
export type ScheduleStatusValues = (typeof ScheduleStatus)[Keys];

export function mapStatusToString(status: ScheduleStatusValues): string {
	switch (status) {
		case ScheduleStatus.SCHEDULED:
			return 'Pendiente';
		case ScheduleStatus.CANCELLED:
			return 'Cancelada';
		case ScheduleStatus.COMPLETED:
			return 'Completada';
		default:
			return 'Pendiente';
	}
}
