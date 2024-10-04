'use client';
import { Availability, Consult, Day, Service, WeekDay } from '@/app/lib/types';
import { SelectV2 } from '../SelectV2';
import { useEffect, useState } from 'react';
import {
	convertMinutesInHoursAndMinutes,
	generateSlotTimes,
	generateWeekDays,
	getDefaultTimezones,
	isCurrentWeek,
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
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from './validate-schema';
import { DateTime, Interval, Settings } from 'luxon';
import Balancer from 'react-wrap-balancer';
import { Loader } from '../Loader';
import { createSchedule } from './action';

type ScheduleFormProps = {
	services: Service[];
	availability: Availability;
	consult: Consult;
	isOnline: boolean;
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
	service_id: string;
	date: string;
	time: string;
	name: string;
	email: string;
	comment: string;
	timezone: string;
};

Settings.defaultLocale = 'es';
Settings.defaultWeekSettings = {
	firstDay: 7,
	minimalDays: 1,
	weekend: [6, 7],
};
export function ScheduleForm({
	services,
	availability,
	consult,
	isOnline,
}: ScheduleFormProps) {
	const [step, setStep] = useState(0);
	const [currentStartWeekDay, setCurrentStartWeekDay] = useState<any>(
		DateTime.now().startOf('week'),
	);
	const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
	const [submissionStatus, setSubmissionStatus] = useState<
		'idle' | 'loading' | 'success' | 'error' | 'warning'
	>('idle');

	const SERVICE_OPTIONS = services?.map(service => {
		return {
			value: service.service_id,
			label: service.name,
		};
	});

	const {
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		control,
		watch,
	} = useForm<ScheduleFormValues>({
		defaultValues: {
			service_id: services[0]?.service_id ?? '',
			date:
				DateTime.now()
					.setZone(getDefaultTimezones(TIMEZONES, availability.timezone))
					.toISODate() ?? '',
			time: '',
			name: '',
			email: '',
			comment: '',
			timezone: isOnline
				? getDefaultTimezones(TIMEZONES, availability.timezone)
				: availability.timezone,
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

		return hours;
	};

	const handleNextWeek = () => {
		setCurrentStartWeekDay(
			currentStartWeekDay.plus({
				week: 1,
			}),
		);
	};

	const handlePrevWeek = () => {
		setCurrentStartWeekDay(
			currentStartWeekDay.minus({
				week: 1,
			}),
		);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [availability, currentStartWeekDay, watch('timezone')]);

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
							<Balancer>Tu cita ha sido reservada</Balancer>
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

	const isPastDay = (currentDay: DateTime) => {
		const today = DateTime.now();

		if (currentDay.hasSame(today, 'day')) return false;

		return currentDay < today;
	};

	const isSameDay = (day1: DateTime, day2: DateTime): boolean => {
		return day1.weekday === day2.weekday;
	};

	const isSameDate = (date1: DateTime, date2: DateTime): boolean => {
		return date1.toFormat('yyyy-MM-dd') === date2.toFormat('yyyy-MM-dd');
	};

	const hightlightCurrentDay = (day1: DateTime, day2: DateTime): boolean => {
		return isSameDay(day1, day2) && isSameDate(day1, day2);
	};

	const hasAvailableHoursForDay = () => {
		const formattedDate = DateTime.fromISO(watch('date'));
		const foundWeekDay = weekDays.find(
			weekDay => weekDay.day.weekday === formattedDate.weekday,
		);

		if (!foundWeekDay || isPastDay(foundWeekDay.day)) {
			return false;
		}

		return foundWeekDay.hours.length > 0;
	};

	const foundHoursForDay = () => {
		const formattedDate = DateTime.fromISO(watch('date'));

		const foundWeekDay = weekDays.find(
			weekDay => weekDay.day.weekday === formattedDate.weekday,
		);

		if (!foundWeekDay) {
			return [];
		}

		return foundWeekDay.hours;
	};

	const isSameTime = (time: DateTime) => {
		return time.toFormat('HH:mm') === watch('time');
	};

	const onSubmit = async (formValues: ScheduleFormValues) => {
		setSubmissionStatus('loading');
		try {
			const availabilityTimezone = availability.timezone;
			const serviceDuration = services.find(
				service => service.service_id === formValues.service_id,
			)?.duration ?? {
				hours: 0,
				minutes: 0,
			};

			const { error, type } = await createSchedule(
				{
					...formValues,
					availability_id: availability.id,
					profesional_id: availability.user_id,
					timezone: watch('timezone'),
					consult_id: consult.id,
				},
				{
					availabilityTimezone,
					serviceDuration,
				},
			);

			if (error) {
				throw {
					type,
				};
			}

			setSubmissionStatus('success');
		} catch (error: any) {
			if (error.type === 'error') {
				setSubmissionStatus('error');
			}

			if (error.type === 'reserved') {
				setSubmissionStatus('warning');
			}
		}
	};

	const formatDate = (date: string) => {
		return DateTime.fromISO(date);
	};

	const isPastTime = (time: string) => {
		const timezone = watch('timezone');
		const formattedTime = DateTime.fromFormat(time, 'HH:mm').setZone(timezone);
		return formattedTime < DateTime.now().setZone(timezone);
	};

	const renderStep = () => {
		if (submissionStatus !== 'idle') {
			return renderSubmissionStatus();
		}

		switch (step) {
			case 0:
				return (
					<>
						{weekDays.length > 0 ? (
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
													options={SERVICE_OPTIONS}
													onChange={field.onChange}
													namespace="motivo-consulta"
													id="motivo-consulta"
												/>
											)}
											name="service_id"
											control={control}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-8 p-4 rounded-lg bg-f-white">
									<div className="h-full">
										<h2 className="text-sm font-light text-neutral-600">Día</h2>
										<div className="flex gap-2 justify-end mb-4 w-full">
											{!isCurrentWeek(currentStartWeekDay) && (
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
															'flex flex-col items-center p-3 rounded-md font-medium text-sm gap-1 w-[72px] whitespace-nowrap',
															hightlightCurrentDay(
																day.day,
																DateTime.fromISO(watch('date')),
															)
																? 'bg-primary-500 text-f-white'
																: 'bg-neutral-100 text-neutral-500',
															isPastDay(day.day) &&
																'bg-neutral-50 text-neutral-200 line-through opacity-70 cursor-not-allowed',
														)}
														onClick={e => {
															e.preventDefault();
															setValue('date', day.day.toISODate() || '');
														}}
														disabled={isPastDay(day.day)}
													>
														<span>{day.day.toFormat('ccc')}</span>
														<span>{day.day.toFormat('dd LLL')}</span>
													</button>
												</li>
											))}
										</ol>
									</div>
									<div>
										<h2 className="mb-4 text-sm font-light text-neutral-600">
											Hora
										</h2>
										{!watch('date') && (
											<p className="text-sm font-light text-neutral-600">
												Selecciona un día para poder visualizar las horas
												disponibles.
											</p>
										)}
										{hasAvailableHoursForDay() ? (
											<ol className="flex flex-wrap gap-3.5">
												{foundHoursForDay()?.map((time, i) => (
													<li key={i}>
														<button
															className={clsx(
																'p-3 font-medium rounded-md w-[72px]',
																isSameTime(time)
																	? 'bg-primary-500 text-f-white'
																	: 'bg-neutral-100 text-neutral-500',
																isSameDate(
																	DateTime.fromISO(watch('date')),
																	DateTime.now(),
																) &&
																	isSameDay(
																		DateTime.fromISO(watch('date')),
																		DateTime.now(),
																	) &&
																	isPastTime(time.toFormat('HH:mm')) &&
																	'bg-neutral-50 text-neutral-200 line-through opacity-70 cursor-not-allowed',
															)}
															onClick={e => {
																e.preventDefault();
																setValue('time', time.toFormat('HH:mm'));
																setStep(1);
															}}
															disabled={
																isSameDay(
																	DateTime.fromISO(watch('date')),
																	DateTime.now(),
																) &&
																isSameDate(
																	DateTime.fromISO(watch('date')),
																	DateTime.now(),
																) &&
																isPastTime(time.toFormat('HH:mm'))
															}
														>
															{time.toFormat('HH:mm')}
														</button>
													</li>
												))}
											</ol>
										) : (
											<p className="text-sm font-light text-neutral-600">
												No hay horas disponibles para este día.
											</p>
										)}
									</div>
									{isOnline && (
										<div>
											<h2 className="mb-4 text-sm font-light text-neutral-600">
												Zona horaria
											</h2>
											<select
												className={clsx(
													'bg-neutral-50 p-2 rounded-lg text-sm w-[62%] font-medium text-neutral-500',
													!isOnline && 'opacity-50',
												)}
												onChange={e => {
													setValue('timezone', e.target.value);
												}}
												value={watch('timezone')}
												disabled={!isOnline}
											>
												{TIMEZONES.map(timezone => (
													<option key={timezone.value} value={timezone.value}>
														{timezone.label}
													</option>
												))}
											</select>
										</div>
									)}
								</div>
							</form>
						) : (
							<div className="flex flex-col gap-4 justify-center items-center h-full">
								<Loader width={'w-8'} height={'h-8'} />
							</div>
						)}
					</>
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
								{formatDate(watch('date')).toFormat('dd')} de{' '}
								{formatDate(watch('date')).toFormat('MMMM')} del{' '}
								{formatDate(watch('date')).toFormat('yyyy')}, {watch('time')}
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

	return <>{renderStep()}</>;
}
