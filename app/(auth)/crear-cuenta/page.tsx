import { SignUpForm } from '@/app/ui/components/Forms/SignUpForm';
import Logo from '@/app/ui/icons/Logo';
import Link from 'next/link';
import React from 'react';

export default function SignUp() {
	return (
		<>
			<header className="container px-6 py-5 mx-auto">
				<Link className="flex items-start gap-2" href="/">
					<Logo width={144} color="#1FBEB8" role="img" aria-label="MiDoctor" />
					<p className="sr-only">MiDoctor</p>
				</Link>
			</header>
			<main className="container px-6 pt-16 mx-auto max-w-96">
				<h1 className="mb-12 text-3xl font-semibold text-center text-f-black">
					Crea tu cuenta
				</h1>

				<SignUpForm />
			</main>
		</>
	);
}
