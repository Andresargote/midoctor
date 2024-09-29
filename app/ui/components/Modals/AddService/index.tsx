'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from '../../Toast';
import { Button } from '../../Button';
import { X } from 'react-bootstrap-icons';
import TextInput from '../../TextInput';
import { SelectV2 } from '../../SelectV2';
import 'react-phone-number-input/style.css';
import { serviceSchema } from '../../ServicesList/validate-schema';
import PriceInput from '../../PriceInput';
import { addService } from '@/app/app/mis-servicios/action';

type AddConsultProps = {
	userId: string;
	opened: boolean;
	handleCloseModal: () => void;
	handleOnSuccess: (data: any) => void;
};

type ServiceFormDefaultValues = {
	name: string;
	price: string;
	duration: {
		hours: string;
		minutes: string;
	};
};

export function AddService({
	userId,
	opened,
	handleCloseModal,
	handleOnSuccess,
}: AddConsultProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [added, setAdded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		control,
	} = useForm<ServiceFormDefaultValues>({
		defaultValues: {
			name: '',
			price: '0',
			duration: {
				hours: '0',
				minutes: '30',
			},
		},
		resolver: zodResolver(serviceSchema),
	});

	const onSubmit = async (formValues: ServiceFormDefaultValues) => {
		setIsLoading(true);
		setError(null);
		setAdded(false);
		try {
			const { data, error } = await addService({
				...formValues,
				owner_id: userId,
			});

			if (error) {
				throw new Error();
			}

			setAdded(true);

			if (data) {
				handleOnSuccess(data);
			}
			handleResetFormValues();
		} catch (error) {
			console.log('here --->', error);
			setError(
				'Ocurrió un error al intentar agregar el servicio. Por favor, intenta de nuevo.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetFormValues = () => {
		reset({
			name: '',
			price: '0',
			duration: {
				hours: '0',
				minutes: '30',
			},
		});
		handleCloseModal();
	};

	const generateHoursSelectOptions = () => {
		const hoursOptions = [
			{
				value: '0',
				label: '0 horas',
			},
		];
		for (let i = 0; i < 8; i++) {
			if (i === 0) {
				hoursOptions.push({
					value: `${i + 1}`,
					label: '1 hora',
				});
			} else {
				hoursOptions.push({
					value: `${i + 1}`,
					label: `${i + 1} horas`,
				});
			}
		}

		return hoursOptions;
	};

	const generateMinutesSelectOptions = () => {
		const minutesOptions = [
			{
				value: '0',
				label: '0 minutos',
			},
		];
		for (let i = 0; i < 55; i += 5) {
			minutesOptions.push({
				value: `${i + 5}`,
				label: `${i + 5} minutos`,
			});
		}

		return minutesOptions;
	};

	const hoursSelectOptions = generateHoursSelectOptions();
	const minutesSelectOptions = generateMinutesSelectOptions();

	return (
		<>
			<Dialog.Root open={opened}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed top-0 left-0 z-50 w-full h-full bg-f-black opacity-15" />

					<Dialog.Content
						aria-disabled={isLoading}
						onInteractOutside={() => {
							if (!isLoading) {
								handleResetFormValues();
							}
						}}
						onEscapeKeyDown={() => {
							if (!isLoading) {
								handleResetFormValues();
							}
						}}
						className="fixed z-50 w-full max-w-md p-8 transform shadow-sm bg-f-white rounded-2xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
						style={{
							transform: 'translate(-50%, -50%)',
							width: 'calc(100% - 1rem)',
						}}
						onOpenAutoFocus={event => {
							event.preventDefault();
						}}
					>
						<Dialog.Title className="max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900">
							Agregar nuevo servicio
						</Dialog.Title>
						<Dialog.Description className="mb-6 text-sm font-light leading-relaxed text-neutral-800">
							Por favor, proporciona la información necesaria para agregar un
							nuevo servicio.
						</Dialog.Description>

						<form
							className="flex flex-col gap-6"
							onSubmit={handleSubmit(onSubmit)}
						>
							<TextInput
								label="Nombre del servicio"
								id="name"
								{...register('name')}
								errorMessage={(errors.name?.message as string) ?? ''}
								autoFocus
							/>
							<PriceInput label="Precio" id="price" {...register('price')} />
							<div className="flex flex-col gap-1.5">
								<label
									className="text-sm font-light text-neutral-600"
									htmlFor="minutes"
								>
									Duración
								</label>
								<div className="flex gap-1.5 justify-between">
									<div className="w-full min-h-14">
										<Controller
											render={({ field }) => (
												<SelectV2
													options={hoursSelectOptions}
													value={field.value}
													onChange={field.onChange}
													namespace="duration_hours"
												/>
											)}
											name="duration.hours"
											control={control}
										/>
									</div>
									<div className="w-full">
										<Controller
											render={({ field }) => (
												<SelectV2
													options={minutesSelectOptions}
													value={field.value}
													onChange={field.onChange}
													namespace="duration_minutes"
												/>
											)}
											name="duration.minutes"
											control={control}
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-end gap-3">
								<Dialog.Close asChild>
									<Button
										bgColorKey="neutral"
										type="button"
										disabled={isLoading}
										onClick={() => {
											if (!isLoading) {
												handleResetFormValues();
											}
										}}
									>
										Cancelar
									</Button>
								</Dialog.Close>

								<Button
									bgColorKey="success"
									type="submit"
									isLoading={isLoading}
									disabled={isLoading}
								>
									Guardar
								</Button>
							</div>
						</form>

						<Dialog.Close asChild>
							<button
								onClick={() => {
									if (!isLoading) {
										handleResetFormValues();
									}
								}}
								type="button"
								className="absolute p-2 rounded-full focused-btn top-4 right-4 bg-neutral-100"
								aria-label="Cerrar modal de creación de servicio"
							>
								<X color="#0A0A0A" width={24} height={24} />
							</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
			{error && <Toast type="error" message={error} />}
			{added && (
				<Toast type="success" message="Servicio agregado exitosamente" />
			)}
		</>
	);
}
