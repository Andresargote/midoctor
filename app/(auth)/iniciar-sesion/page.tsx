import React from 'react';
import Link from 'next/link';
import Logo from '@/app/ui/icons/Logo';
import { SignInForm } from '@/app/ui/components/Forms/SignInForm';

export default function SignIn() {
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
          Bienvenido de nuevo
        </h1>

        <SignInForm />
      </main>
    </>
  );
}
