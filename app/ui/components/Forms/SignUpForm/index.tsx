'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../Button';
import TextInput from '../../TextInput';
import { signUpSchema } from './validate-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Provider } from '../../Provider';
import Google from '@/app/ui/icons/Google';
import { Separator } from '../../Separator';
import { Toast } from '../../Toast';

type SignUpFormDefaultValues = {
  fullName: string;
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
      fullName: '',
      email: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormDefaultValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const { fullName, email } = data;
      console.log(fullName, email);
    } catch (error) {
      setError(
        'Ocurrió un error al intentar crear su cuenta, por favor intenta de nuevo, si el problema persiste contacta a soporte.',
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
          text="Crear cuenta con Google"
        />
      </div>
      <Separator>O</Separator>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          id="fullName"
          label="Nombre completo"
          {...register('fullName')}
          errorMessage={(errors['fullName']?.message as string) ?? ''}
        />
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
