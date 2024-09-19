'use client';
import type { Service } from '@/app/lib/types';
import { useEffect, useState } from 'react';

export function ServicesList({ data }: { data: Service[] }) {
  const [services, setServices] = useState(data ?? []);

  useEffect(() => {
    setServices(data);
  }, [data]);

  return (
    <>
      <main>
        {services.length === 0 ? (
          <p className='text-lg font-light text-center text-neutral-800'>
            Aún no tienes servicios registrados
          </p>
        ) : (
          <ul className='grid grid-cols-1 gap-6'>
            {services.map((service) => (
              <li
                key={service.service_id}
                className='flex items-center justify-between p-4 rounded-lg shadow-sm bg-f-white'
              >
                <div>
                  <h3 className='text-lg font-semibold text-neutral-900'>
                    {service.name}
                  </h3>
                  <p className='text-sm font-light text-neutral-800'>
                    {service.duration.hours} horas {service.duration.minutes} minutos
                  </p>
                </div>
                <div>
                  <p className='text-lg font-semibold text-neutral-900'>
                    ${service.price / 100}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
