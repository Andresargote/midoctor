import { createClient } from '@/app/lib/utils/supabase/server';
import { ClientForm } from '@/app/ui/components/ClientForm';
import Logo from '@/app/ui/icons/Logo';
import Image from 'next/image';
import { GeoAlt, Telephone } from 'react-bootstrap-icons';

export default async function Profesional({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const { username } = params;
  const supabase = createClient();

  const { data } = await supabase.from('profiles').select('*').eq('username', username);

  const profesional = data ? data[0] : {};

  const { data: consultData } = await supabase
    .from('consults')
    .select('*')
    .eq('user_id', profesional?.id);

  const consult = consultData ? consultData[0] : {};

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', profesional?.id);

  function centsToDolar(quantity: number) {
    return quantity / 100;
  }

  function calcDuration(hours: number, minutes: number) {
    let hoursAndMinutes = '';

    if (hours) {
      hoursAndMinutes += `${hours} ${hours !== 1 ? 'horas' : 'hora'}`;

      if (minutes) {
        hoursAndMinutes += ` y ${minutes} ${minutes !== 1 ? 'minutos' : 'minutos'}`;
      }

      return hoursAndMinutes;
    }

    if (minutes) {
      hoursAndMinutes += `${minutes} ${minutes !== 1 ? 'minutos' : 'minutos'}`;

      return hoursAndMinutes;
    }
  }

  const { data: availabilityData } = await supabase
    .from('availabilities')
    .select('*')
    .eq('user_id', profesional?.id);

  const availability = availabilityData ? availabilityData[0] : null;

  return (
    <>
      <header className='px-4 py-6 bg-f-white'>
        <div className='max-w-screen-lg m-auto'>
          <Logo width={144} color='#1FBEB8' role='img' aria-label='MiDoctor' />
        </div>
      </header>
      <main className='flex h-screen px-4 py-6'>
        <div className='grid max-w-screen-lg grid-cols-1 m-auto shadow-sm md:grid-cols-2 bg-f-white rounded-xl'>
          <section className='flex flex-col gap-6 px-4 py-6'>
            {profesional?.avatar_url && (
              <Image
                alt={`Foto de perfil de ${profesional?.full_name}`}
                src={profesional?.avatar_url}
                width={150}
                height={150}
                className='object-cover rounded-full'
              />
            )}
            <div>
              {profesional?.full_name && (
                <h1 className='text-lg font-medium text-neutral-900'>
                  {profesional.full_name}
                </h1>
              )}
              {consult?.address && (
                <address className='text-sm font-light text-neutral-500'>
                  {consult?.address}
                </address>
              )}
            </div>
            {profesional?.about_me && (
              <div>
                <h2 className='mb-1 font-medium text-neutral-900'>Sobre mí</h2>
                <p className='leading-relaxed text-neutral-500'>
                  {profesional?.about_me}
                </p>
              </div>
            )}
            {consult && !consult.is_online && (
              <div className='flex flex-col gap-1'>
                <h2 className='font-medium text-neutral-900'>Información de consulta</h2>
                <address className='flex items-center gap-2 not-italic text-neutral-500 mb'>
                  {<GeoAlt />} {consult?.address}
                </address>
                <address className='flex items-center gap-2 not-italic text-neutral-500'>
                  {<Telephone />} {consult?.phone_number}
                </address>
              </div>
            )}
            {services && services?.length > 0 && (
              <div>
                <h2 className='mb-1 font-medium text-neutral-900'>Mis servicios</h2>
                <ul className='flex flex-col gap-3'>
                  {services.map((service) => (
                    <li
                      key={service.service_id}
                      className='flex flex-col list-none text-neutral-500'
                    >
                      <h3 className='text-neutral-900'>
                        {service.name} - ${centsToDolar(service.price)}
                      </h3>

                      {service?.duration && (
                        <span className='text-sm'>
                          Duración:{' '}
                          {calcDuration(
                            service?.duration.hours,
                            service?.duration.minutes
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          <aside className='flex flex-col gap-6 px-4 py-6 bg-primary-500 rounded-xl'>
            <ClientForm services={services ?? []} availability={availability} />
          </aside>
        </div>
      </main>
    </>
  );
}
