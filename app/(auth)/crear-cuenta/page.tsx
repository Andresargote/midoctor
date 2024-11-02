import { SignUpForm } from '@/app/ui/components/Forms/SignUpForm';
import Logo from '@/app/ui/icons/Logo';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
	title: 'Crear cuenta - MiDoctor',
	description:
		'Crea una cuenta en MiDoctor para gestionar las citas con tus pacientes.',
};

export default function SignUp() {
	return (
		<>
			<header className="container px-6 py-5 mx-auto">
				<Link className="flex items-start gap-2" href="/">
					<Logo width={144} color="#1FBEB8" role="img" aria-label="MiDoctor" />
				</Link>
			</header>

			<SignUpForm />
		</>
	);
}
