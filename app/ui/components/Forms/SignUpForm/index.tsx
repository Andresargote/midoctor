'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../Button';
import TextInput from '../../TextInput';
import { signUpSchema } from './validate-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from '../../Toast';
import { signUp } from '@/app/(auth)/crear-cuenta/action';

type SignUpFormDefaultValues = {
  email: string;
};

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
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
    } catch (error) {
      setError(
        'Ocurrió un error al iniciar sesión, por favor intenta de nuevo, si el problema persiste contacta con soporte.',
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
          {...register('email')}
          type="email"
          errorMessage={(errors['email']?.message as string) ?? ''}
        />
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          Crear cuenta
        </Button>
      </form>
      {error && <Toast type="error" message={error} />}
    </>
  );
}
