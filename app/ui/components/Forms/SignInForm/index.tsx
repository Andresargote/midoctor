"use client";

import { signIn } from "@/app/(auth)/iniciar-sesion/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../Button";
import TextInput from "../../TextInput";
import { Toast } from "../../Toast";
import { signInSchema } from "./validate-schema";

type SignInFormDefaultValues = {
	email: string;
};

export function SignInForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormDefaultValues>({
		defaultValues: {
			email: "",
		},
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = async (formValues: SignInFormDefaultValues) => {
		setIsLoading(true);
		setError(null);
		try {
			const { email } = formValues;

			const { error } = await signIn(email);

			if (error) {
				throw new Error();
			}
		} catch (error) {
			setError(
				"Ocurrió un error al iniciar sesión, por favor intenta de nuevo, si el problema persiste contacta con soporte.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<TextInput
					id="email"
					label="Email"
					{...register("email")}
					type="email"
					errorMessage={(errors.email?.message as string) ?? ""}
				/>
				<Button
					type="submit"
					disabled={isLoading}
					isLoading={isLoading}
					aria-label="Botón para iniciar sesión"
				>
					Iniciar sesión
				</Button>
			</form>
			{error && <Toast type="error" message={error} />}
		</>
	);
}
