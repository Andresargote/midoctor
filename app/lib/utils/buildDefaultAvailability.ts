import { Availability } from '../types';

type CreateAvailability = Omit<Availability, 'id'>;

export function buildDefaultAvailability(user_id: string): CreateAvailability {
	return {
		user_id,
		name: 'Disponibilidad',
		timezone: 'America/Caracas',
		active: true,
		days: [
			{
				idDay: 7,
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
						start: '09:00',
						end: '18:00',
					},
				],
			},
			{
				idDay: 2,
				day: 'Martes',
				available: true,
				slots: [
					{
						start: '09:00',
						end: '18:00',
					},
				],
			},
			{
				idDay: 3,
				day: 'Miércoles',
				available: true,
				slots: [
					{
						start: '09:00',
						end: '18:00',
					},
				],
			},
			{
				idDay: 4,
				day: 'Jueves',
				available: true,
				slots: [
					{
						start: '09:00',
						end: '18:00',
					},
				],
			},
			{
				idDay: 5,
				day: 'Viernes',
				available: true,
				slots: [
					{
						start: '09:00',
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
}
