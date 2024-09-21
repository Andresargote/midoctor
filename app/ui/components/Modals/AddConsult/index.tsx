'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultSchema } from '../../ConsultsList/validate-schema';
import { addConsult as AddConsultAction } from '@/app/app/mi-consultorio/action';
import { Toast } from '../../Toast';
import { Button } from '../../Button';
import { X } from 'react-bootstrap-icons';
import TextInput from '../../TextInput';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type AddConsultProps = {
	userId: string;
	opened: boolean;
	handleCloseModal: () => void;
	handleOnSuccess: (data: any) => void;
};

type ConsultFormDefaultValues = {
	is_online: boolean;
	name: string;
	address: string;
	phone_number: string;
};

export function AddConsult({
	userId,
	opened,
	handleCloseModal,
	handleOnSuccess,
}: AddConsultProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isOnline, setIsOnline] = useState(false);
	const [added, setAdded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		setValue,
		register,
		handleSubmit,
		reset,
		formState: { errors },
		control,
		watch,
	} = useForm<ConsultFormDefaultValues>({
		defaultValues: {
			is_online: false,
			name: '',
			address: '',
			phone_number: '',
		},
		resolver: zodResolver(consultSchema(isOnline)),
	});

	const onSubmit = async (formValues: ConsultFormDefaultValues) => {
		setIsLoading(true);
		setError(null);
		try {
			const { data, error } = await AddConsultAction({
				...formValues,
				user_id: userId,
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
			setError(
				'Ocurrió un error al agregar el consultorio, por favor intenta de nuevo, si el problema persiste contacta con soporte.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetFormValues = () => {
		reset({
			is_online: false,
			name: '',
			address: '',
			phone_number: '',
		});
		setIsOnline(false);
		handleCloseModal();
	};

	useEffect(() => {
		setIsOnline(watch('is_online'));
	}, [watch('is_online')]);

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
						className="fixed top-2/4 left-2/4 z-50 p-8 w-full max-w-md rounded-2xl shadow-sm transform -translate-x-2/4 -translate-y-2/4 bg-f-white"
						style={{
							transform: 'translate(-50%, -50%)',
							width: 'calc(100% - 1rem)',
						}}
						onOpenAutoFocus={event => {
							event.preventDefault();
						}}
					>
						<Dialog.Title className="max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900">
							Agregar nuevo consultorio
						</Dialog.Title>
						<Dialog.Description className="mb-6 text-sm font-light leading-relaxed text-neutral-800">
							Por favor, proporciona la información necesaria para agregar un
							nuevo consultorio.
						</Dialog.Description>

						<form
							className="flex flex-col gap-6"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="flex gap-3 items-center">
								<Controller
									render={({ field }) => (
										<Switch.Root
											id="is_online"
											className="SwitchRoot"
											checked={field.value}
											onCheckedChange={field.onChange}
										>
											<Switch.Thumb className="SwitchThumb" />
										</Switch.Root>
									)}
									name="is_online"
									control={control}
								/>
								<label
									htmlFor="is_online"
									className="flex gap-4 items-center text-sm text-f-black"
								>
									Consulta virtual
								</label>
							</div>
							<TextInput
								label="Nombre del consultorio"
								id="name"
								{...register('name')}
								errorMessage={(errors.name?.message as string) ?? ''}
								autoFocus
								helperText="El nombre de tu consultorio solo es visible para ti."
							/>
							{!watch('is_online') && (
								<TextInput
									label="Dirección del consultorio"
									id="address"
									{...register('address')}
									errorMessage={(errors.address?.message as string) ?? ''}
								/>
							)}

							<div className="flex flex-col gap-1.5">
								<label
									className="text-sm font-light text-neutral-600"
									htmlFor="phone_number"
								>
									Teléfono del consultorio
								</label>
								<Controller
									name="phone_number"
									control={control}
									render={({ field }) => (
										<PhoneInput
											id="phone_number"
											placeholder="Número de teléfono"
											defaultCountry="VE"
											countries={['VE']}
											country="VE"
											value={field.value}
											onChange={value => {
												field.onChange(value);
												setValue('phone_number', value as string);
											}}
										/>
									)}
								/>
								{errors.phone_number && (
									<span className="text-xs font-semibold text-error-500 font-xs">
										{errors.phone_number.message}
									</span>
								)}
							</div>
							<div className="flex gap-3 justify-end items-center">
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
								className="absolute top-4 right-4 p-2 rounded-full focused-btn bg-neutral-100"
								aria-label="Cerrar modal de creación de consultorio"
							>
								<X color="#0A0A0A" width={24} height={24} />
							</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
			{error && <Toast type="error" message={error} />}
			{added && (
				<Toast type="success" message="Consultorio agregado exitosamente" />
			)}
		</>
	);
}
