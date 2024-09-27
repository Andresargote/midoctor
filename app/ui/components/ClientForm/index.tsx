'use client';

import { Availability, Day, Service } from '@/app/lib/types';
import { SelectV2 } from '../SelectV2';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { generateHoursAndMinutes } from '@/app/lib/utils';
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
import Balancer from 'react-wrap-balancer';
import { Loader } from '../Loader';

type ClientFormProps = {
	services: Service[];
	availability: Availability;
};

/*
TODO:
	- mostrar horas no disponibles
	- tener en cuenta el timezone
	- refactorizar el codigo, usar useForm
*/

type ClientFormValues = {
	service: string;
	day: dayjs.Dayjs;
	hour: string;
	name: string;
	email: string;
	comment: string;
};

dayjs.locale('es');
export function ClientForm({ services, availability }: ClientFormProps) {
	const [step, setStep] = useState(0);
	const [currentWeekStart, setCurrentWeekStart] = useState(
		dayjs().startOf('week').add(0, 'day'),
	);
	const [submissionStatus, setSubmissionStatus] = useState<
		'idle' | 'loading' | 'success' | 'error' | 'warning'
	>('warning');

	const getWeekDays = (startDate: dayjs.Dayjs) => {
		const days = [];
		for (let i = 0; i < 7; i++) {
			days.push(startDate.add(i, 'day'));
		}
		return days;
	};
	const weekDays = getWeekDays(currentWeekStart);

	const serviceOptions = services?.map(service => {
		return {
			value: service.name,
			label: service.name,
		};
	});

	const getHoursByDay = (day: dayjs.Dayjs | null) => {
		if (day) {
			const dayOfWeek = day.day();
			const slots = availability?.days.find(
				day => day.idDay === dayOfWeek,
			)?.slots;
			let hours = [];

			if (slots) {
				for (const slot of slots) {
					const generatedHoursAndMinutes = generateHoursAndMinutes(
						slot.start,
						slot.end,
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
			hour: '',
			name: '',
			email: '',
			comment: '',
			// TODO: add timezone
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
								{getHoursByDay(watch('day')).length > 0 ? (
									<ol className="flex flex-wrap gap-3.5">
										{getHoursByDay(watch('day'))?.map((hour, i) => (
											<li key={i}>
												<button
													className={clsx(
														'p-3 font-medium rounded-md w-[72px]',
														hour === watch('hour')
															? 'bg-primary-500 text-f-white'
															: 'bg-neutral-100 text-neutral-600',
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

	return <>{renderStep()}</>;
}
