'use client';

import { mapDateTimeToString } from '@/app/lib/shared/time';
import { Schedule } from '@/app/lib/types';
import { capitalize } from '@/app/lib/utils/capitalize';
import { DateTime, Settings } from 'luxon';
import { useState } from 'react';
import { Trash3 } from 'react-bootstrap-icons';
import { CancelScheduleModal } from '../Modals/CancelSchedule';
import { mapStatusToString } from '@/app/lib/scheduleStatus';
import { cancelScheduleAction } from './action';
import { Toast } from '../Toast';

export type ShedulesListProps = {
	schedules: Schedule[];
};

type CancelScheduleModalData = {
	visible: boolean;
	schedule: Schedule | null;
};

Settings.defaultLocale = 'es';
export function SchedulesList({ schedules }: ShedulesListProps) {
	const [cancelScheduleModal, setCancelScheduleModal] =
		useState<CancelScheduleModalData>({
			visible: false,
			schedule: null,
		});

	const [actionResult, setActionResult] = useState({
		success: false,
		error: false,
	});

	async function cancelSchedule(schedule: Schedule) {
		const res = await cancelScheduleAction(schedule.id);

		setActionResult({
			error: !!res.error,
			success: !res.error,
		});
	}

	return (
		<>
			{cancelScheduleModal.visible && (
				<CancelScheduleModal
					isOpen={cancelScheduleModal.visible}
					schedule={cancelScheduleModal.schedule!}
					handleCloseModal={() =>
						setCancelScheduleModal({ visible: false, schedule: null })
					}
					handleCancelSchedule={cancelSchedule}
				/>
			)}
			{actionResult.error && (
				<Toast
					message="Ha ocurrido un error al cancelar la reserva, por favor intenta de nuevo."
					type="error"
				/>
			)}
			{actionResult.success && (
				<Toast message="Reserva cancelada exitosamente" type="success" />
			)}
			<ol className="grid grid-cols-1 gap-6">
				{schedules?.map(schedule => {
					const professional_date = DateTime.fromISO(
						schedule.professional_time.start_at,
					);

					return (
						<li key={schedule.id} className="bg-f-white rounded-lg">
							<div className="bg-neutral-200 p-4 rounded-t-lg flex items-center justify-between">
								<time
									dateTime={professional_date.toISO()!}
									className="font-medium text-neutral-900"
								>
									{mapDateTimeToString(
										DateTime.fromISO(schedule.professional_time.start_at),
									)}{' '}
									-{' '}
									{mapDateTimeToString(
										DateTime.fromISO(schedule.professional_time.end_at),
									)}
								</time>

								<button
									onClick={() =>
										setCancelScheduleModal({ visible: true, schedule })
									}
									type="button"
									className="flex items-center justify-center w-8 h-8 transition duration-300 rounded-md hover:bg-error-50 focused-btn"
									aria-label="Botón para eliminar consultorio"
								>
									<Trash3 color="#EF4444" />
								</button>
							</div>
							<div className="p-4 rounded-b-lg">
								<p className="text-lg font-light text-neutral-900">
									Cliente: {capitalize(schedule.name)}
								</p>
								<p className="text-md font-light text-neutral-800">
									Servicio: {capitalize(schedule.service?.name)}
								</p>
								<p className="text-md font-light text-neutral-800">
									Estado: {mapStatusToString(schedule.status)}
								</p>
								<p className="text-sm font-light text-neutral-800">
									{schedule.comment}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
		</>
	);
}
