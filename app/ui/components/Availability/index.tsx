"use client";
import type { Availability as AvailabilityType, Day } from "@/app/lib/types";
import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import { PlusLg, Trash3 } from "react-bootstrap-icons";
import Select from "../Select";

/*
 - A tener en cuenta:
	- Cuando se pasa de deshabilitado a habilitado, se debe mostrar un input para agregar franjas horarias. (hay que tener en cuenta si existe un slots ya agregado)
	- Generar horas de inicio y fin cada 15 minutos.
*/

export type AvailabilityProps = {
	availability: AvailabilityType;
};

export function Availability({ availability }: AvailabilityProps) {
	const [value, setValues] = useState<AvailabilityType>(availability);

	const handleDisableDay = (day: string) => {
		setValues((prev) => ({
			...prev,
			days: prev.days.map((d) =>
				d.day === day
					? {
							...d,
							available: !d.available,
							slots:
								!d.available && d.slots.length === 0
									? [{ start: "08:00", end: "18:00" }]
									: d.slots,
						}
					: d,
			),
		}));
	};

	return (
		<form className="flex flex-col gap-6">
			{value.days.map((availability) => (
				<AvailabilityRow
					key={availability.idDay}
					availability={availability}
					handleDisableDay={handleDisableDay}
				/>
			))}
		</form>
	);
}

export function AvailabilityRow({
	availability,
	handleDisableDay,
}: {
	availability: Day;
	handleDisableDay: (day: string) => void;
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
							<div className="w-28">
								<Select
									id={`${availability.day}_start_time`}
									options={[{ value: slot.start, label: slot.start }]}
									defaultValue={slot.start}
									style="min-h-10"
								/>
							</div>
							<div className="w-28">
								<Select
									id={`${availability.day}_end_time`}
									options={[{ value: slot.end, label: slot.end }]}
									defaultValue={slot.end}
									style="min-h-10"
								/>
							</div>
							{i === 0 && (
								<button
									aria-label="Agregar franja horaria"
									type="button"
									className="flex items-center justify-center w-8 h-8 transition duration-300 rounded-md hover:bg-neutral-200 focused-btn"
									onClick={() => console.log("clicked")}
								>
									<PlusLg />
								</button>
							)}
							{i > 0 && (
								<button
									aria-label="Eliminar franja horaria"
									type="button"
									className="flex items-center justify-center w-8 h-8 transition duration-300 rounded-md hover:bg-error-200 focused-btn"
									onClick={() => console.log("clicked")}
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
