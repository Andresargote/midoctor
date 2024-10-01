'use client';

import { signUp } from '@/app/(auth)/crear-cuenta/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../Button';
import TextInput from '../../TextInput';
import { Toast } from '../../Toast';
import { signUpSchema } from './validate-schema';
import Balancer from 'react-wrap-balancer';

type SignUpFormDefaultValues = {
	email: string;
};

export function SignUpForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [isMagicLinkSent, setIsMagicLinkSent] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const {
		watch,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormDefaultValues>({
		defaultValues: {
			email: '',
		},
		resolver: zodResolver(signUpSchema),
	});
	const onSubmit = async (formValues: SignUpFormDefaultValues) => {
		setIsLoading(true);
		setError(null);
		try {
			const { email } = formValues;

			const { error } = await signUp(email);

			if (error) {
				throw new Error();
			}
			setIsMagicLinkSent(true);
		} catch (error) {
			setError(
				'Ocurrió un error al crear tu cuenta, por favor intenta de nuevo, si el problema persiste contacta con soporte.',
			);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<main className="container px-6 pt-16 mx-auto">
			{isMagicLinkSent ? (
				<div className="flex flex-col gap-4 justify-center items-center h-full mx-auto max-w-128 text-center">
					<h1 className="text-3xl font-semibold text-neutral-900 ">
						<Balancer>Revisa tu correo para continuar</Balancer>
					</h1>
					<p className="text-sm leading-relaxed text-neutral-500">
						<Balancer>
							Te hemos enviado un enlace para crear tu cuenta a {watch('email')}
						</Balancer>
					</p>
					<p className="text-sm leading-relaxed text-neutral-500">
						<Balancer>
							Si no recibes un correo en breve, revisa tu bandeja de spam o
							contacta con soporte.
						</Balancer>
					</p>
				</div>
			) : (
				<div className="mx-auto max-w-96">
					<h1 className="mb-12 text-3xl font-semibold text-center text-f-black">
						Crea tu cuenta
					</h1>

					<form
						className="flex flex-col gap-4"
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextInput
							id="email"
							label="Email"
							{...register('email')}
							type="email"
							errorMessage={(errors.email?.message as string) ?? ''}
						/>
						<Button
							type="submit"
							disabled={isLoading}
							isLoading={isLoading}
							aria-label="Botón para crear cuenta"
						>
							Crear cuenta
						</Button>
					</form>
				</div>
			)}
			{error && <Toast type="error" message={error} />}
		</main>
	);
}
