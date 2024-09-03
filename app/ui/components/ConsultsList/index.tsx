'use client';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { X } from 'react-bootstrap-icons';
import PhoneInput from 'react-phone-number-input';
import { Button } from '../Button';
import TextInput from '../TextInput';
import 'react-phone-number-input/style.css';
import { addConsult as AddConsultAction } from '@/app/app/mi-consultorio/action';
import type { Consult } from '@/app/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from '../Toast';
import { consultSchema } from './validate-schema';

type ConsultFormDefaultValues = {
  is_online: boolean;
  name: string;
  address: string;
  phone_number: string;
};

export function ConsultsList({
  userId,
  consultsData,
}: {
  userId: string;
  consultsData: Consult[];
}) {
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(false);
  const [consults, setConsults] = useState(consultsData ?? []);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
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
        setConsults((prevConsults) => [...prevConsults, data]);
      }

      handleResetFormValues();
    } catch (error) {
      setError(
        'Ocurrió un error al agregar el consultorio, por favor intenta de nuevo, si el problema persiste contacta con soporte.'
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
    router.back();
  };

  return (
    <>
      <Dialog.Root open={action === 'new'}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed top-0 left-0 z-50 w-full h-full bg-f-black opacity-15' />

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
            className='fixed z-50 w-full max-w-md p-8 transform shadow-sm bg-f-white rounded-2xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'
            style={{
              transform: 'translate(-50%, -50%)',
              width: 'calc(100% - 1rem)',
            }}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
            }}
          >
            <Dialog.Title className='max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900'>
              Agregar nuevo consultorio
            </Dialog.Title>
            <Dialog.Description className='mb-6 text-sm font-light leading-relaxed text-neutral-800'>
              Por favor, proporciona la información necesaria para agregar un nuevo
              consultorio.
            </Dialog.Description>

            <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex items-center gap-3'>
                <Switch.Root
                  id='is_online'
                  className='SwitchRoot'
                  checked={isOnline}
                  onCheckedChange={(checked) => {
                    setIsOnline(checked);
                    setValue('is_online', checked);
                  }}
                  {...register('is_online')}
                >
                  <Switch.Thumb className='SwitchThumb' />
                </Switch.Root>
                <label
                  htmlFor='is_online'
                  className='flex items-center gap-4 text-sm text-f-black'
                >
                  Consulta virtual
                </label>
              </div>
              <TextInput
                label='Nombre del consultorio'
                id='name'
                {...register('name')}
                errorMessage={(errors.name?.message as string) ?? ''}
                autoFocus
                helperText='El nombre de tu consultorio solo es visible para ti.'
              />
              {!isOnline && (
                <TextInput
                  label='Dirección del consultorio'
                  id='address'
                  {...register('address')}
                  errorMessage={(errors.address?.message as string) ?? ''}
                />
              )}

              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm font-light text-neutral-600'
                  htmlFor='phone_number'
                >
                  Teléfono del consultorio
                </label>
                <Controller
                  name='phone_number'
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id='phone_number'
                      placeholder='Número de teléfono'
                      defaultCountry='VE'
                      countries={['VE']}
                      country='VE'
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue('phone_number', value as string);
                      }}
                    />
                  )}
                />
                {errors.phone_number && (
                  <span className='text-xs font-semibold text-error-500 font-xs'>
                    {errors.phone_number.message}
                  </span>
                )}
              </div>
              <div className='flex items-center justify-end gap-3'>
                <Dialog.Close asChild>
                  <Button
                    bgColorKey='neutral'
                    type='button'
                    disabled={isLoading}
                    onClick={() => {
                      handleResetFormValues();
                    }}
                  >
                    Cancelar
                  </Button>
                </Dialog.Close>

                <Button
                  bgColorKey='success'
                  type='submit'
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
                  handleResetFormValues();
                }}
                type='button'
                className='absolute p-2 rounded-full focused-btn top-4 right-4 bg-neutral-100'
                aria-label='Cerrar modal de creación de consultorio'
              >
                <X color='#0A0A0A' width={24} height={24} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {error && <Toast type='error' message={error} />}
      {added && <Toast type='success' message='Consultorio agregado exitosamente' />}
      {consults.length === 0 ? (
        <p className='text-lg font-light text-center text-neutral-800'>
          Aún no tienes consultorios registrados
        </p>
      ) : (
        <main className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr'>
          {consults?.map((consult) => (
            <div key={consult.id} className='h-full p-4 rounded-lg shadow-sm bg-f-white'>
              <h2 className='mb-2 text-xl font-semibold text-neutral-900'>
                {consult.name}
              </h2>
              <div className='p-2 rounded-full w-fit bg-neutral-100'>
                <p className='text-xs font-base text-neutral-900'>
                  {consult.is_online ? 'Consulta virtual' : 'Consulta presencial'}
                </p>
              </div>
              {consult.address && (
                <p className='mt-4 text-sm font-light leading-relaxed text-neutral-800'>
                  {consult.address}
                </p>
              )}
            </div>
          ))}
        </main>
      )}
    </>
  );
}
