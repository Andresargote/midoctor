'use client';
import type {
	Availability as AvailabilityType,
	Day,
	Slot,
} from '@/app/lib/types';
import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';
import { PlusLg, Trash3 } from 'react-bootstrap-icons';
import { generateHoursAndMinutes } from '@/app/lib/utils';
import { SelectV2 } from '../SelectV2';
import { Button } from '../Button';
import { editAvailabilyDays } from '@/app/app/mi-disponibilidad/action';
import { Toast } from '../Toast';

export type AvailabilityProps = {
	availability: AvailabilityType;
};

const START_TIMES = generateHoursAndMinutes('06:00', '23:59', 15).map(time => ({
	value: time,
	label: parseInt(time.split(':')[0]) > 12 ? `${time}pm` : `${time}am`,
}));
const END_TIMES = generateHoursAndMinutes('06:00', '23:59', 15).map(time => ({
	value: time,
	label: parseInt(time.split(':')[0]) > 12 ? `${time}pm` : `${time}am`,
}));

export function Availability({ availability }: AvailabilityProps) {
	const [updated, setUpdated] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValues] = useState<AvailabilityType>(availability);

	const handleDisableDay = (day: string) => {
		setValues(prev => ({
			...prev,
			days: prev.days.map(d =>
				d.day === day
					? {
							...d,
							available: !d.available,
							slots:
								!d.available && d.slots.length === 0
									? [{ start: '08:00', end: '18:00' }]
									: d.slots,
						}
					: d,
			),
		}));
	};

	const previousStartAndEnd = (slots: Slot[]) => {
		const lastSlot = slots[slots.length - 1];
		const lastSlotEnd = lastSlot.end.split(':');

		const start = parseInt(lastSlotEnd[0]) + 1;
		const end = start + 1 === 24 ? 23 : start + 1;

		if (start === 24) {
			return null;
		}

		return {
			start: `${start}:00`,
			end: end === 23 ? '23:59' : `${end}:00`,
		};
	};

	const handleAddSlot = (day: string) => {
		const findDaySlots = value.days.find(d => d.day === day)?.slots;

		if (findDaySlots) {
			const calcNewSlotHours = previousStartAndEnd(findDaySlots);
			if (calcNewSlotHours) {
				setValues(prev => ({
					...prev,
					days: prev.days.map(d =>
						d.day === day
							? {
									...d,
									slots: [
										...d.slots,
										{
											start: calcNewSlotHours.start,
											end: calcNewSlotHours.end,
										},
									],
								}
							: d,
					),
				}));
			}
		}
	};

	const handleRemoveSlot = (day: string, index: number) => {
		setValues(prev => ({
			...prev,
			days: prev.days.map(d =>
				d.day === day
					? { ...d, slots: d.slots.filter((_, i) => i !== index) }
					: d,
			),
		}));
	};

	const handleChangeSlot = (day: string, index: number, slot: Slot) => {
		setValues(prev => ({
			...prev,
			days: prev.days.map(d =>
				d.day === day
					? {
							...d,
							slots: d.slots.map((s, i) => (i === index ? slot : s)),
						}
					: d,
			),
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setUpdated(false);
		try {
			const { error } = await editAvailabilyDays({
				availabilityId: availability.id,
				days: value.days,
			});

			if (error) {
				throw new Error();
			}

			setUpdated(true);
		} catch (error) {
			console.error('Error editing availability:', error);
			setError(
				'Ocurrió un error al intentar actualizar la disponibilidad. Por favor, intenta de nuevo.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
				{value.days.map(availability => (
					<AvailabilityRow
						key={availability.idDay}
						availability={availability}
						handleDisableDay={handleDisableDay}
						handleAddSlot={handleAddSlot}
						handleRemoveSlot={handleRemoveSlot}
						handleChangeSlot={handleChangeSlot}
					/>
				))}
				<div className="mt-6">
					<Button
						bgColorKey="success"
						type="submit"
						isLoading={isLoading}
						disabled={isLoading}
					>
						Guardar cambios
					</Button>
				</div>
			</form>
			{error && <Toast type="error" message={error} />}
			{updated && (
				<Toast
					type="success"
					message="Disponibilidad actualizada exitosamente"
				/>
			)}
		</>
	);
}

export function AvailabilityRow({
	availability,
	handleDisableDay,
	handleAddSlot,
	handleRemoveSlot,
	handleChangeSlot,
}: {
	availability: Day;
	handleDisableDay: (day: string) => void;
	handleAddSlot: (day: string) => void;
	handleRemoveSlot: (day: string, index: number) => void;
	handleChangeSlot: (day: string, index: number, slot: Slot) => void;
}) {
	return (
		<div className="flex flex-col items-start gap-6 md:flex-row">
			<div className="flex items-center w-40 gap-3">
				<Switch.Root
					id={`${availability.day}_is_available`}
					className="SwitchRoot"
					checked={availability.available}
					onClick={() => handleDisableDay(availability.day)}
				>
					<Switch.Thumb className="SwitchThumb" />
				</Switch.Root>
				<label
					htmlFor={`${availability.day}_is_available`}
					className="flex items-center gap-4 text-md text-f-black"
				>
					{availability.day}
				</label>
			</div>
			{availability.available && availability.slots.length > 0 && (
				<div className="flex flex-col gap-1">
					{availability.slots.map((slot, i) => (
						<div key={slot.start} className="flex items-center gap-2">
							<div className="h-12 w-36">
								<SelectV2
									value={slot.start}
									options={START_TIMES}
									namespace={`${availability.day}_start_time`}
									onChange={value => {
										handleChangeSlot(availability.day, i, {
											...slot,
											start: value,
										});
									}}
									label="Selecciona hora de inicio"
								/>
							</div>
							<div className="h-12 w-36">
								<SelectV2
									value={slot.end}
									options={END_TIMES}
									namespace={`${availability.day}_end_time`}
									onChange={value => {
										handleChangeSlot(availability.day, i, {
											...slot,
											end: value,
										});
									}}
									label="Selecciona hora de fin"
								/>
							</div>
							{i === 0 && (
								<button
									aria-label="Agregar franja horaria"
									type="button"
									className="flex items-center justify-center w-8 h-8 transition duration-300 rounded-md hover:bg-neutral-200 focused-btn"
									onClick={() => handleAddSlot(availability.day)}
								>
									<PlusLg />
								</button>
							)}
							{i > 0 && (
								<button
									aria-label="Eliminar franja horaria"
									type="button"
									className="flex items-center justify-center w-8 h-8 transition duration-300 rounded-md hover:bg-error-200 focused-btn"
									onClick={() => handleRemoveSlot(availability.day, i)}
								>
									<Trash3 />
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
