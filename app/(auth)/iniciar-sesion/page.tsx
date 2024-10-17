import { SignInForm } from '@/app/ui/components/Forms/SignInForm';
import Logo from '@/app/ui/icons/Logo';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
	title: 'Iniciar sesión - MiDoctor',
	description:
		'Inicia sesión en MiDoctor para gestionar las citas con tus pacientes.',
};

export default function SignIn() {
	return (
		<>
			<header className="container px-6 py-5 mx-auto">
				<Link className="flex items-start gap-2 w-fit" href="/">
					<Logo width={144} color="#1FBEB8" role="img" aria-label="MiDoctor" />
					<p className="sr-only">MiDoctor</p>
				</Link>
			</header>

			<SignInForm />
		</>
	);
}
