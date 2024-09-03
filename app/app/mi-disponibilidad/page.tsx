import { createClient } from '@/app/lib/utils/supabase/server';
import { Availability } from '@/app/ui/components/Availability';
import { Suspense } from 'react';

export default async function MiDisponibilidad() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const { data: availibilities } = await supabase
    .from('availabilities')
    .select('*')
    .eq('user_id', data?.user?.id);

  return (
    <div className='px-4 py-6 mx-auto'>
      <div className='container mx-auto lg:pl-72'>
        <header className='flex flex-col justify-between w-full gap-6 mb-12 md:flex-row'>
          <div>
            <h1 className='mb-2 text-3xl font-semibold text-neutral-900'>
              Mi Disponibilidad
            </h1>
            <p className='font-light leading-relaxed text-neutral-800'>
              Aquí puedes ver y editar la información de tu disponibilidad.
            </p>
          </div>
        </header>
        <main>
          <Suspense fallback={<div>Cargando...</div>}>
            {availibilities?.length === 0 && <p>No hay disponibilidadades agregadas</p>}

            {availibilities && availibilities?.length > 0 && (
              <Availability availability={availibilities[0]} />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
