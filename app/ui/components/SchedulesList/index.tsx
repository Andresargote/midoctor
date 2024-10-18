'use client';

import { Schedule } from '@/app/lib/types';
import { capitalize } from '@/app/lib/utils/capitalize';
import { DateTime, Settings } from 'luxon';
import { useEffect, useState } from 'react';
import { Trash3 } from 'react-bootstrap-icons';
import { CancelScheduleModal } from '../Modals/CancelSchedule';
import {
	mapStatusToString,
	ScheduleStatus,
	ScheduleStatusValues,
} from '@/app/lib/scheduleStatus';
import { cancelScheduleAction, completeScheduleAction } from './action';
import { Toast } from '../Toast';
import { CompleteScheduleModal } from '../Modals/CompleteScheduleModal';

export type ShedulesListProps = {
	data: Schedule[];
};

type CancelScheduleModalData = {
	visible: boolean;
	schedule: Schedule | null;
};

type MarkAsCompletedModalData = {
	visible: boolean;
	schedule: Schedule | null;
};

Settings.defaultLocale = 'es';
export function SchedulesList({ data }: ShedulesListProps) {
	const [schedules, setSchedules] = useState(data ?? []);
	const [cancelScheduleModal, setCancelScheduleModal] =
		useState<CancelScheduleModalData>({
			visible: false,
			schedule: null,
		});
	const [markAsCompletedModal, setMarkAsCompletedModal] =
		useState<MarkAsCompletedModalData>({
			visible: false,
			schedule: null,
		});

	const [actionResult, setActionResult] = useState({
		success: false,
		error: false,
	});

	const [completeActionResult, setCompleteActionResult] = useState({
		success: false,
		error: false,
	});

	async function cancelSchedule(schedule: Schedule) {
		const res = await cancelScheduleAction(schedule.id);

		setActionResult({
			error: !!res.error,
			success: !res.error,
		});

		if (!res.error) {
			setSchedules(prev =>
				prev.map(s => {
					if (s.id === schedule.id) {
						return {
							...s,
							status: ScheduleStatus.CANCELLED,
						};
					}
					return s;
				}),
			);
		}
	}

	async function completeSchedule(schedule: Schedule) {
		const res = await completeScheduleAction(schedule.id);

		setCompleteActionResult({
			error: !!res.error,
			success: !res.error,
		});

		if (!res.error) {
			setSchedules(prev =>
				prev.map(s => {
					if (s.id === schedule.id) {
						return {
							...s,
							status: ScheduleStatus.COMPLETED,
						};
					}
					return s;
				}),
			);
		}
	}

	const backgroundByStatus = (status: ScheduleStatusValues) => {
		switch (status) {
			case ScheduleStatus.SCHEDULED:
				return 'bg-warning-500';
			case ScheduleStatus.CANCELLED:
				return 'bg-error-500';
			case ScheduleStatus.COMPLETED:
				return 'bg-success-500';
			default:
				return 'bg-warning-500';
		}
	};

	useEffect(() => {
		setSchedules(data);
	}, [data]);

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
			{markAsCompletedModal.visible && (
				<CompleteScheduleModal
					isOpen={markAsCompletedModal.visible}
					schedule={markAsCompletedModal.schedule!}
					handleCloseModal={() =>
						setMarkAsCompletedModal({ visible: false, schedule: null })
					}
					handleCompleteSchedule={completeSchedule}
				/>
			)}
			{completeActionResult.error && (
				<Toast
					message="Ha ocurrido un error al marcar como completada, por favor intenta de nuevo."
					type="error"
				/>
			)}
			{completeActionResult.success && (
				<Toast
					message="Cita marcada como completada exitosamente"
					type="success"
				/>
			)}
			{data?.length === 0 ? (
				<p className="text-lg font-light text-center text-neutral-800">
					Aún no tienes citas reservadas
				</p>
			) : (
				<ol className="grid grid-cols-1 gap-6">
					{schedules?.map(schedule => {
						const professional_date = DateTime.fromISO(
							schedule.professional_time.start_at,
						);

						return (
							<li
								key={schedule.id}
								className="bg-f-white rounded-lg flex flex-col "
							>
								<div className="bg-neutral-200 p-4 rounded-t-lg flex items-center justify-between flex-wrap gap-4">
									<time
										dateTime={professional_date.toISO()!}
										className="font-medium text-neutral-900"
									>
										{capitalize(
											DateTime.fromISO(
												schedule.professional_time.start_at,
											).toFormat('DDDD'),
										)}
									</time>

									<div className="flex items-center gap-4">
										{schedule.status === ScheduleStatus.SCHEDULED && (
											<button
												onClick={() => {
													setMarkAsCompletedModal({
														visible: true,
														schedule,
													});
												}}
												className="text-xs bg-success-500 text-f-white px-4 py-2 rounded-md transition duration-300 hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2"
												aria-label="Botón para abrir modal de marcar como completada"
											>
												Marcar cita como completada
											</button>
										)}

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
								</div>
								<div className="p-4 rounded-b-lg flex flex-col gap-4">
									<div className="flex items-center gap-4">
										<div className="flex gap-1 items-center">
											<div
												className={`w-4 h-4 rounded-full ${backgroundByStatus(schedule.status)} text-f-white`}
											></div>
											<span className="text-xs text-neutral-400 font-medium">
												{mapStatusToString(schedule.status)}
											</span>
										</div>
										<div className="flex gap-1">
											<time
												dateTime={schedule.professional_time.start_at}
												className="font-light text-neutral-900"
											>
												{DateTime.fromISO(
													schedule.professional_time.start_at,
												).toFormat('HH:mm')}
											</time>
											<span className="font-light text-neutral-900">-</span>
											<time
												dateTime={schedule.professional_time.end_at}
												className="font-light text-neutral-900"
											>
												{DateTime.fromISO(
													schedule.professional_time.end_at,
												).toFormat('HH:mm')}
											</time>
										</div>
									</div>
									<div className="flex flex-col gap-1">
										<p className="text-xs font-light text-neutral-600">
											Nombre paciente:{' '}
											<span className="text-base text-neutral-900 font-medium">
												{capitalize(schedule.name)}
											</span>
										</p>
										<p className="text-xs font-light text-neutral-600">
											Servicio:{' '}
											<span className="text-base text-neutral-900 font-medium">
												{capitalize(schedule.service?.name)}
											</span>
										</p>

										{schedule.comment && (
											<p className="text-xs font-light text-neutral-600">
												Comentario:{' '}
												<span className="text-base text-neutral-900 font-medium">
													{schedule.comment}
												</span>
											</p>
										)}
									</div>
								</div>
							</li>
						);
					})}
				</ol>
			)}
		</>
	);
}
