import { Availability } from '@/app/ui/components/Availability';

export default function MiDisponibilidad() {
  const DEFAULT_availability = {
    timezone: 'America/Caracas',
    name: 'Default timezone',
    active: true,
    days: [
      {
        idDay: 0,
        day: 'Domingo',
        available: false,
        slots: [],
      },
      {
        idDay: 1,
        day: 'Lunes',
        available: true,
        slots: [
          {
            start: '08:00',
            end: '12:00',
          },
        ],
      },
      {
        idDay: 2,
        day: 'Martes',
        available: true,
        slots: [
          {
            start: '08:00',
            end: '12:00',
          },
        ],
      },
      {
        idDay: 3,
        day: 'Miércoles',
        available: true,
        slots: [
          {
            start: '08:00',
            end: '12:00',
          },
        ],
      },
      {
        idDay: 4,
        day: 'Jueves',
        available: true,
        slots: [
          {
            start: '08:00',
            end: '12:00',
          },
        ],
      },
      {
        idDay: 5,
        day: 'Viernes',
        available: true,
        slots: [
          {
            start: '08:00',
            end: '12:00',
          },
          {
            start: '14:00',
            end: '18:00',
          },
        ],
      },
      {
        idDay: 6,
        day: 'Sábado',
        available: false,
        slots: [],
      },
    ],
  };

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
          <Availability availability={DEFAULT_availability} />
        </main>
      </div>
    </div>
  );
}
