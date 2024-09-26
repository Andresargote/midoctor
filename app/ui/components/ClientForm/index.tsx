'use client';

import { Availability, Service } from '@/app/lib/types';
import { SelectV2 } from '../SelectV2';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { generateHoursAndMinutes } from '@/app/lib/utils';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

type ClientFormProps = {
  services: Service[];
  availability: Availability;
};

/**
 *  Agregar al select un placeholder, el select del servicio debe de mostrar un placeholder que sea: Motivo de consulta
 *
 */

/*
    - crear UI del formulario de disponibilidad
    - crear scroll
    - mostrar horas no disponibles
    - tener en cuenta el timezone

    - podes listar los días de la semana, poder hacer scroll e ir sumando semanas en el futuro, mostrar las horas de los dias las horas debo mostrarlas en el timezone de la persona
*/
const TIMEZONES = [
  { value: 'America/Argentina/Buenos_Aires', label: '(GMT-3) Buenos Aires, Argentina' },
  { value: 'America/Bogota', label: '(GMT-5) Bogotá, Colombia' },
  { value: 'America/Lima', label: '(GMT-5) Lima, Perú' },
  { value: 'America/Mexico_City', label: '(GMT-6) Ciudad de México, México' },
  { value: 'America/Panama', label: '(GMT-5) Panamá, Panamá' },
  { value: 'America/Santiago', label: '(GMT-4) Santiago, Chile' },
  { value: 'America/Guayaquil', label: '(GMT-5) Guayaquil, Ecuador' },
  { value: 'America/Montevideo', label: '(GMT-3) Montevideo, Uruguay' },
  {
    value: 'America/Santo_Domingo',
    label: '(GMT-4) Santo Domingo, República Dominicana',
  },
  { value: 'America/Miami', label: '(GMT-4) Miami, Estados Unidos' },
  { value: 'America/Toronto', label: '(GMT-4) Toronto, Canadá' },
  { value: 'Europe/Madrid', label: '(GMT+2) Madrid, España' },
  { value: 'Europe/Lisbon', label: '(GMT+1) Lisboa, Portugal' },
  { value: 'Europe/Rome', label: '(GMT+2) Roma, Italia' },
  { value: 'America/Costa_Rica', label: '(GMT-6) San José, Costa Rica' },
  { value: 'America/Asuncion', label: '(GMT-4) Asunción, Paraguay' },
  { value: 'America/La_Paz', label: '(GMT-4) La Paz, Bolivia' },
  { value: 'America/Port_of_Spain', label: '(GMT-4) Puerto España, Trinidad y Tobago' },
  { value: 'America/Curacao', label: '(GMT-4) Curazao' },
  { value: 'America/Caracas', label: '(GMT-4) Caracas, Venezuela' },
];

dayjs.locale('es');
export function ClientForm({ services, availability }: ClientFormProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf('week').add(0, 'day')
  );

  const [currentDay, setCurrentDay] = useState<null | dayjs.Dayjs>(dayjs());
  const [currentHour, setCurrentHour] = useState('');

  const getWeekDays = (startDate: dayjs.Dayjs) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startDate.add(i, 'day'));
    }
    return days;
  };

  const [service, setService] = useState(services[0]?.name);
  const serviceOptions = services?.map((service) => {
    return {
      value: service.name,
      label: service.name,
    };
  });

  const weekDays = getWeekDays(currentWeekStart);

  const getHoursByDay = (day: dayjs.Dayjs | null) => {
    if (day) {
      const dayOfWeek = day.day();
      const slots = availability.days.find((day) => day.idDay === dayOfWeek)?.slots;
      let hours = [];

      if (slots) {
        for (const slot of slots) {
          const generatedHoursAndMinutes = generateHoursAndMinutes(
            slot.start,
            slot.end,
            60
          );

          hours.push(generatedHoursAndMinutes);
        }
      }

      return hours.flat();
    }

    return [];
  };

  const isCurrentDayBeforeToday = (currentDay: dayjs.Dayjs) => {
    const today = dayjs();

    if (currentDay.isSame(today, 'day')) {
      return false;
    }

    return currentDay.isBefore(today);
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.add(1, 'week'));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(currentWeekStart.subtract(1, 'week'));
  };

  const today = dayjs().startOf('week');

  const isCurrentWeek = currentWeekStart.isSame(today, 'week');

  const isDayInCurrentWeek = (day: dayjs.Dayjs) => {
    return currentWeekStart.isSame(day, 'week');
  };

  return (
    <form>
      <div className='flex flex-col gap-2'>
        <label className='text-sm' htmlFor='motivo-consulta'>
          Motivo de la consulta:
        </label>
        <div className='h-12 mb-6'>
          <SelectV2
            label='Elige el motivo de la visita'
            value={service}
            options={serviceOptions}
            onChange={(value) => {
              setService(value);
            }}
            namespace='motivo-consulta'
            id='motivo-consulta'
          />
        </div>
      </div>
      <div className='flex flex-col gap-8 p-4 rounded-lg bg-f-white'>
        <div>
          <h2 className='font-medium text-neutral-500'>Dia</h2>
          <div className='flex justify-end w-full gap-2 mb-4'>
            {!isCurrentWeek && (
              <button
                className='p-1 rounded-full shadow-sm bg-f-white'
                onClick={(e) => {
                  e.preventDefault();
                  handlePrevWeek();
                }}
              >
                <ChevronLeft color='#0A0A0A' />
              </button>
            )}
            <button
              className='p-1 rounded-full shadow-sm bg-f-white'
              onClick={(e) => {
                e.preventDefault();
                handleNextWeek();
              }}
            >
              <ChevronRight color='#0A0A0A' />
            </button>
          </div>
          <ol className='flex flex-wrap gap-4'>
            {weekDays.map((day, i) => (
              <li key={i}>
                <button
                  className={clsx(
                    'flex flex-col items-center p-3 rounded-md font-medium text-sm gap-1 w-[72px]',
                    currentDay &&
                      currentDay.format('ddd') === day.format('ddd') &&
                      isDayInCurrentWeek(currentDay)
                      ? 'bg-success-500 text-f-white'
                      : 'bg-neutral-200 text-neutral-500',
                    isCurrentDayBeforeToday(day) &&
                      'bg-neutral-50 text-neutral-200 line-through'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentDay(day);
                  }}
                  disabled={isCurrentDayBeforeToday(day)}
                >
                  <span>{day.format('ddd')}</span>
                  <span>{day.format('D MMM')}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className='mb-4 font-medium text-neutral-500'>Hora</h2>
          {getHoursByDay(currentDay).length > 0 ? (
            <ol className='flex flex-wrap gap-3.5'>
              {getHoursByDay(currentDay)?.map((hour, i) => (
                <li key={i}>
                  <button
                    className={clsx(
                      'p-3 font-medium rounded-md w-[72px]',
                      hour === currentHour
                        ? 'bg-success-500 text-f-white'
                        : 'bg-neutral-200 text-neutral-600'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentHour(hour);
                    }}
                  >
                    {hour}
                  </button>
                </li>
              ))}
            </ol>
          ) : !currentDay ? (
            <p className='text-sm font-light text-neutral-600'>
              Selecciona un día para poder visualizar las horas disponibles.
            </p>
          ) : (
            <p className='text-sm font-light text-neutral-600'>
              No hay horas disponibles para este día.
            </p>
          )}
        </div>
        <div>
          <h2 className='mb-4 font-medium text-neutral-500'>Zona horaria</h2>
          <select className='w-[64%] px-4 py-2 border rounded-lg bg-f-white border-neutral-300 text-f-black text-sm'>
            {TIMEZONES.map((timezone) => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
