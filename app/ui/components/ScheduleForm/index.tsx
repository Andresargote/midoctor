'use client';

import { Availability, Day, Service, WeekDay } from '@/app/lib/types';
import { SelectV2 } from '../SelectV2';
import { useEffect, useState } from 'react';
//import dayjs from 'dayjs';
import {
	convertMinutesInHoursAndMinutes,
	generateSlotTimes,
	generateWeekDays,
	getDefaultTimezones,
	setHoursInWeekDays,
	setIsAvailableInWeekDays,
} from '@/app/lib/utils';
import clsx from 'clsx';
import {
	Calendar4,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clipboard2Pulse,
	ExclamationTriangle,
	XCircle,
} from 'react-bootstrap-icons';
import TextInput from '../TextInput';
import TextareaInput from '../TextareaInput';
import { Button } from '../Button';
import { Controller, set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from './validate-schema';
import { DateTime, Interval } from 'luxon';

type ScheduleFormProps = {
	services: Service[];
	availability: Availability;
};

const TIMEZONES = [
	{
		value: 'America/Argentina/Buenos_Aires',
		label: '(GMT-3) Buenos Aires, Argentina', // No cambia con DST
	},
	{ value: 'America/Bogota', label: '(GMT-5) Bogotá, Colombia' }, // No cambia con DST
	{ value: 'America/Lima', label: '(GMT-5) Lima, Perú' }, // No cambia con DST
	{
		value: 'America/Mexico_City',
		label: '(GMT-6 / GMT-5) Ciudad de México, México',
	}, // Cambia con DST
	{ value: 'America/Panama', label: '(GMT-5) Panamá, Panamá' }, // No cambia con DST
	{ value: 'America/Santiago', label: '(GMT-4 / GMT-3) Santiago, Chile' }, // Cambia con DST
	{ value: 'America/Guayaquil', label: '(GMT-5) Guayaquil, Ecuador' }, // No cambia con DST
	{ value: 'America/Montevideo', label: '(GMT-3) Montevideo, Uruguay' }, // No cambia con DST
	{
		value: 'America/Santo_Domingo',
		label: '(GMT-4) Santo Domingo, República Dominicana', // No cambia con DST
	},
	{ value: 'America/New_York', label: '(GMT-5 / GMT-4) Miami, Estados Unidos' }, // Cambia con DST
	{ value: 'America/Toronto', label: '(GMT-5 / GMT-4) Toronto, Canadá' }, // Cambia con DST
	{ value: 'Europe/Madrid', label: '(GMT+1 / GMT+2) Madrid, España' }, // Cambia con DST
	{ value: 'Europe/Lisbon', label: '(GMT+0 / GMT+1) Lisboa, Portugal' }, // Cambia con DST
	{ value: 'Europe/Rome', label: '(GMT+1 / GMT+2) Roma, Italia' }, // Cambia con DST
	{ value: 'America/Costa_Rica', label: '(GMT-6) San José, Costa Rica' }, // No cambia con DST
	{ value: 'America/Asuncion', label: '(GMT-4 / GMT-3) Asunción, Paraguay' }, // Cambia con DST
	{ value: 'America/La_Paz', label: '(GMT-4) La Paz, Bolivia' }, // No cambia con DST
	{
		value: 'America/Port_of_Spain',
		label: '(GMT-4) Puerto España, Trinidad y Tobago', // No cambia con DST
	},
	{ value: 'America/Curacao', label: '(GMT-4) Curazao' }, // No cambia con DST
	{ value: 'America/Caracas', label: '(GMT-4) Caracas, Venezuela' }, // No cambia con DST
];

type ScheduleFormValues = {
	service: string;
	date: string;
	time: string;
	name: string;
	email: string;
	comment: string;
	timezone: string;
};

export function ScheduleForm({ services, availability }: ScheduleFormProps) {
	/*console.log('disponibilidad', availability);
	const [step, setStep] = useState(0);
	const [currentWeekStart, setCurrentWeekStart] = useState(
		dayjs().startOf('week').add(0, 'day'),
	);
	const [submissionStatus, setSubmissionStatus] = useState<
		'idle' | 'loading' | 'success' | 'error' | 'warning'
	>('idle');
	const [hoursByDayAndTimezone, setHoursByDayAndTimezone] = useState<string[]>(
		[],
	);
	// array de dates
	const [weekHours, setWeekHours] = useState<null[]>([]);

	const generateWeekdaysV2 = (startWeekDate: dayjs.Dayjs) => {
		const days = [];
		for (let i = 0; i < 7; i++) {
			days.push(startWeekDate.add(i, 'day'));
		}
		return days;
	}

	const generateHoursByWeekdaysAndTimezone = (
		startWeekDate: dayjs.Dayjs,
		timezone: string,
		availability: Availability,
	) => {
		
	}

	const getWeekDays = (startDate: dayjs.Dayjs) => {
		const days = [];
		for (let i = 0; i < 7; i++) {
			days.push(startDate.add(i, 'day'));
		}
		return days;
	};

	const serviceOptions = services?.map(service => {
		return {
			value: service.name,
			label: service.name,
		};
	});

	const weekDays = getWeekDays(currentWeekStart);

	const getHoursByDayAndTimezone = (
		day: dayjs.Dayjs | null,
		timezone: string,
	) => {
		if (day) {
			const dayOfWeek = day.day();
			const slots = availability?.days.find(
				day => day.idDay === dayOfWeek,
			)?.slots;
			let hours = [];

			const calcStartAtAndEndAtByUserTimezone = (
				start: string,
				end: string,
			) => {
				if (timezone === availability.timezone) return [start, end];

				const availabilityStartAt = dayjs.tz(
					`${day.format('YYYY-MM-DD')} ${start}`,
					availability.timezone,
				);
				const availabilityEndAt = dayjs.tz(
					`${day.format('YYYY-MM-DD')} ${end}`,
					availability.timezone,
				);

				const startAt = availabilityStartAt.tz(timezone).format('HH:mm');
				const endAt = availabilityEndAt.tz(timezone).format('HH:mm');

				return [startAt, endAt];
			};

			if (slots) {
				for (const slot of slots) {
					const [startAt, endAt] = calcStartAtAndEndAtByUserTimezone(
						slot.start,
						slot.end,
					);

					const generatedHoursAndMinutes = generateHoursAndMinutes(
						startAt,
						endAt,
						60,
					);

					hours.push(generatedHoursAndMinutes);
				}
			}

			return hours.flat();
		}

		return [];
	};

	const isCurrentDayBeforeToday = (currentDay: dayjs.Dayjs) => {
		const today = dayjs();

		if (currentDay.isSame(today, 'day')) {
			return false;
		}

		return currentDay.isBefore(today);
	};

	const handleNextWeek = () => {
		setCurrentWeekStart(currentWeekStart.add(1, 'week'));
	};

	const handlePrevWeek = () => {
		setCurrentWeekStart(currentWeekStart.subtract(1, 'week'));
	};

	const today = dayjs().startOf('week');

	const isCurrentWeek = currentWeekStart.isSame(today, 'week');

	const isDayInCurrentWeek = (day: dayjs.Dayjs) => {
		return currentWeekStart.isSame(day, 'week');
	};

	const isTimeZoneExist = (timezone: string) => {
		return TIMEZONES.find(tz => tz.value === timezone);
	};

	const {
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		control,
		watch,
	} = useForm<ClientFormValues>({
		defaultValues: {
			service: services[0]?.name,
			day: dayjs(),
			clientDay: null, // para manejar excepcion,cuando por ejemplo cambia de timezone y las horas son diferentes y algunas pasan al siguiente dia
			hour: '',
			name: '',
			email: '',
			comment: '',
			timezone: isTimeZoneExist(
				Intl.DateTimeFormat().resolvedOptions().timeZone,
			)
				? Intl.DateTimeFormat().resolvedOptions().timeZone
				: availability.timezone,
		},
		resolver: zodResolver(clientSchema),
	});

	const onSubmit = (formValues: ClientFormValues) => {
		console.log(formValues);
	};

	const renderSubmissionStatus = () => {
		switch (submissionStatus) {
			case 'loading':
				return (
					<div className="flex flex-col gap-4 justify-center items-center h-full">
						<div className="flex flex-col justify-center items-center w-20 h-20 rounded-full bg-primary-500">
							<Clipboard2Pulse color="#FFFF" size={40} />
						</div>
						<h3 className="text-xl font-semibold text-center text-neutral-900">
							<Balancer>Estamos preparando tu cita</Balancer>
						</h3>
						<Loader />
					</div>
				);
			case 'success':
				return (
					<div className="flex flex-col gap-4 justify-center items-center h-full">
						<div className="flex flex-col justify-center items-center w-20 h-20 rounded-full bg-primary-500">
							<CheckCircle color="#FFFF" size={40} />
						</div>
						<h3 className="text-xl font-semibold text-center text-neutral-900">
							<Balancer>Tu cita ha sido confirmada</Balancer>
						</h3>
						<p className="text-sm leading-relaxed text-center text-neutral-500">
							<Balancer>
								Gracias por confiar en nosotros. En unos segundos recibirás
								todos los detalles por correo.
							</Balancer>
						</p>
					</div>
				);
			case 'error':
				return (
					<div className="flex flex-col gap-4 justify-center items-center h-full">
						<div className="flex flex-col justify-center items-center w-20 h-20 rounded-full bg-error-500">
							<XCircle color="#FFFF" size={40} />
						</div>
						<h3 className="text-xl font-semibold text-center text-neutral-900">
							<Balancer>Ups parece que algo salió mal</Balancer>
						</h3>
						<p className="text-sm leading-relaxed text-center text-neutral-500">
							<Balancer>
								Lo sentimos, ha ocurrido un problema. Por favor, vuelve a
								intentarlo.
							</Balancer>
						</p>
						<Button
							onClick={() => {
								setSubmissionStatus('idle');
								setStep(0);
							}}
						>
							Volver a intentar
						</Button>
					</div>
				);
			case 'warning':
				return (
					<div className="flex flex-col gap-4 justify-center items-center h-full">
						<div className="flex flex-col justify-center items-center w-20 h-20 rounded-full bg-warning-500">
							<ExclamationTriangle color="#FFFF" size={40} />
						</div>
						<h3 className="text-xl font-semibold text-center text-neutral-900">
							<Balancer>La hora seleccionada ya no está disponible</Balancer>
						</h3>
						<p className="text-sm leading-relaxed text-center text-neutral-500">
							<Balancer>
								Parece que la hora que elegiste ya no está disponible. Por
								favor, selecciona otra hora para continuar con la reserva.
							</Balancer>
						</p>
						<Button
							onClick={() => {
								setSubmissionStatus('idle');
								setStep(0);
							}}
						>
							Seleccionar otra hora
						</Button>
					</div>
				);

			default:
				return null;
		}
	};

	const renderStep = () => {
		if (submissionStatus !== 'idle') {
			return renderSubmissionStatus();
		}

		switch (step) {
			case 0:
				return (
					<form>
						<div className="flex flex-col gap-2">
							<label
								className="text-sm font-light text-neutral-600"
								htmlFor="motivo-consulta"
							>
								Motivo de la consulta:
							</label>
							<div className="mb-6 h-12">
								<Controller
									render={({ field }) => (
										<SelectV2
											label="Elige el motivo de la visita"
											value={field.value}
											options={serviceOptions}
											onChange={field.onChange}
											namespace="motivo-consulta"
											id="motivo-consulta"
										/>
									)}
									name="service"
									control={control}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-8 p-4 rounded-lg bg-f-white">
							<div>
								<h2 className="text-sm font-light text-neutral-600">Dia</h2>
								<div className="flex gap-2 justify-end mb-4 w-full">
									{!isCurrentWeek && (
										<button
											className="p-1 rounded-full shadow-sm bg-f-white"
											onClick={e => {
												e.preventDefault();
												handlePrevWeek();
											}}
										>
											<ChevronLeft color="#0A0A0A" />
										</button>
									)}
									<button
										className="p-1 rounded-full shadow-sm bg-f-white"
										onClick={e => {
											e.preventDefault();
											handleNextWeek();
										}}
									>
										<ChevronRight color="#0A0A0A" />
									</button>
								</div>
								<ol className="flex flex-wrap gap-4">
									{weekDays.map((day, i) => (
										<li key={i}>
											<button
												className={clsx(
													'flex flex-col items-center p-3 rounded-md font-medium text-sm gap-1 w-[72px]',
													watch('day') &&
														watch('day').format('ddd') === day.format('ddd') &&
														isDayInCurrentWeek(watch('day'))
														? 'bg-primary-500 text-f-white'
														: 'bg-neutral-100 text-neutral-500',
													isCurrentDayBeforeToday(day) &&
														'bg-neutral-50 text-neutral-200 line-through opacity-70',
												)}
												onClick={e => {
													e.preventDefault();
													setValue('day', day);
												}}
												disabled={isCurrentDayBeforeToday(day)}
											>
												<span>{day.format('ddd')}</span>
												<span>{day.format('D MMM')}</span>
											</button>
										</li>
									))}
								</ol>
							</div>
							<div>
								<h2 className="mb-4 text-sm font-light text-neutral-600">
									Hora
								</h2>
								{hoursByDayAndTimezone.length > 0 ? (
									<ol className="flex flex-wrap gap-3.5">
										{hoursByDayAndTimezone?.map((hour, i) => (
											<li key={i}>
												<button
													className={clsx(
														'p-3 font-medium rounded-md w-[72px]',
														hour === watch('hour')
															? 'bg-primary-500 text-f-white'
															: 'bg-neutral-100 text-neutral-500',
													)}
													onClick={e => {
														e.preventDefault();
														setValue('hour', hour);
														setStep(1);
													}}
												>
													{hour}
												</button>
											</li>
										))}
									</ol>
								) : !watch('day') ? (
									<p className="text-sm font-light text-neutral-600">
										Selecciona un día para poder visualizar las horas
										disponibles.
									</p>
								) : (
									<p className="text-sm font-light text-neutral-600">
										No hay horas disponibles para este día.
									</p>
								)}
							</div>
							<div>
								<h2 className="mb-4 text-sm font-light text-neutral-600">
									Zona horaria
								</h2>
								<select
									className="bg-neutral-50 p-2 rounded-lg text-sm w-[62%] font-medium text-neutral-500"
									onChange={e => {
										setValue('timezone', e.target.value);
									}}
									value={watch('timezone')}
								>
									{TIMEZONES.map(timezone => (
										<option key={timezone.value} value={timezone.value}>
											{timezone.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</form>
				);
			case 1:
				return (
					<>
						<div>
							<button
								className="p-1 rounded-full shadow-sm bg-f-white"
								onClick={() => {
									setStep(0);
								}}
							>
								<ChevronLeft color="#0A0A0A" />
							</button>
						</div>
						<div className="flex gap-2 items-center text-sm">
							<Calendar4 color="#0F172A" />
							<p className="text-sm font-light text-neutral-900">
								{watch('day')?.format('DD')} de {watch('day')?.format('MMMM')}{' '}
								del {watch('day')?.format('YYYY')}, {watch('hour')}
							</p>
						</div>
						<form
							className="flex flex-col gap-4"
							onSubmit={handleSubmit(onSubmit)}
						>
							<TextInput
								label="Nombre"
								id="name"
								type="text"
								{...register('name')}
								errorMessage={(errors.name?.message as string) ?? ''}
							/>
							<TextInput
								label="Email"
								id="email"
								type="email"
								{...register('email')}
								errorMessage={(errors.email?.message as string) ?? ''}
							/>
							<TextareaInput
								label="Comentario para el profesional"
								id="comentario"
								placeholder="Escribe aquí tu comentario"
								{...register('comment')}
							/>
							<Button type="submit">Reservar</Button>
						</form>
					</>
				);
			default:
				return null;
		}
	};

	useEffect(() => {
		const availabilityTimezone = availability.timezone;
		const hours = getHoursByDayAndTimezone(
			watch('day'),
			watch('timezone') ? watch('timezone') : availabilityTimezone,
		);
		setHoursByDayAndTimezone(hours);
	}, [watch('day'), watch('timezone')]);

	return <>{renderStep()}</>;*/

	const [currentStartWeekDay, setCurrentStartWeekDay] = useState<any>(
		DateTime.now().startOf('week'),
	);

	const [weekDays, setWeekDays] = useState<WeekDay[]>([]);

	const {
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		control,
		watch,
	} = useForm<ScheduleFormValues>({
		defaultValues: {
			service: services[0]?.name,
			date:
				DateTime.now()
					.setZone(getDefaultTimezones(TIMEZONES, availability.timezone))
					.toISODate() ?? '',
			time: '',
			name: '',
			email: '',
			comment: '',
			timezone: getDefaultTimezones(TIMEZONES, availability.timezone),
		},
		resolver: zodResolver(clientSchema),
	});

	const generateHoursByAvailabilityDaysAndTimezone = ({
		days,
		timezone,
		availabilityTimezone,
		availabilityIntervalMinutes,
		currentStartWeekDay,
	}: {
		days: Day[];
		timezone: string;
		availabilityTimezone: string;
		availabilityIntervalMinutes: number;
		currentStartWeekDay: DateTime;
	}) => {
		const hours = [];
		for (const day of days) {
			if (!day.available) continue;
			const dayDate = currentStartWeekDay
				.plus({ days: day.idDay })
				.setZone(availabilityTimezone);
			for (const slot of day.slots) {
				if (timezone !== availabilityTimezone) {
					const { startAt, endAt } = generateSlotTimes(slot, dayDate, timezone);

					const interval = Interval.fromDateTimes(startAt, endAt);
					let indexStartAt = startAt;

					hours.push(indexStartAt);

					const [intervalHours, intervalMinutes] =
						convertMinutesInHoursAndMinutes(availabilityIntervalMinutes);

					while (interval.contains(indexStartAt)) {
						indexStartAt = indexStartAt.plus({
							hours: intervalHours,
							minutes: intervalMinutes,
						});
						hours.push(indexStartAt);
					}
				}
			}
		}

		return hours;
	};

	useEffect(() => {
		// generate hours
		const { timezone: availabilityTimezone, days: availabilityDays } =
			availability;

		const selectedTimezone = watch('timezone');

		const generatedHours = generateHoursByAvailabilityDaysAndTimezone({
			days: availabilityDays,
			timezone: selectedTimezone,
			availabilityTimezone,
			availabilityIntervalMinutes: 60,
			currentStartWeekDay,
		});

		// set hours in week days
		const weekDays = generateWeekDays(currentStartWeekDay);
		const weekDaysWithHours = setHoursInWeekDays(weekDays, generatedHours);
		const weekDaysWithHoursAndIsAvailable = setIsAvailableInWeekDays(
			weekDaysWithHours,
			availability.days,
		);
		setWeekDays(weekDaysWithHoursAndIsAvailable);
	}, [availability, watch('timezone'), currentStartWeekDay]);

	return <p>Imagine</p>;
}
