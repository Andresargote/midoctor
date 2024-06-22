'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../Button';
import TextInput from '../../TextInput';
import { signInSchema } from './validate-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Provider } from '../../Provider';
import Google from '@/app/ui/icons/Google';
import { Separator } from '../../Separator';
import { Toast } from '../../Toast';

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
      email: '',
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormDefaultValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const { email } = data;
      console.log(email);
    } catch (error) {
      setError(
        'Ocurrió un error al iniciar sesión, por favor intenta de nuevo, si el problema persiste contacta a soporte.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-column mb-7">
        <Provider
          disabled={isLoading}
          icon={Google}
          text="Iniciar sesión con Google"
        />
      </div>
      <Separator>O</Separator>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          id="email"
          label="Email"
          {...register('email')}
          type="email"
          errorMessage={(errors['email']?.message as string) ?? ''}
        />
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          Iniciar sesión
        </Button>
      </form>
      {error && <Toast type="error" message={error} />}
    </>
  );
}
