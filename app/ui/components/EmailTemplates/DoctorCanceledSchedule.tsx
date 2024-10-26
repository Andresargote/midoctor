import { capitalize } from '@/app/lib/utils/capitalize';
import { Settings, DateTime } from 'luxon';

type Props = {
	name: string;
	startAt: DateTime;
};

Settings.defaultLocale = 'es';

export function DoctorCanceledSchedule({ name, startAt }: Props) {
	return (
		<>
			<h1 style={{ color: '#1FBEB8' }}>MiDoctor</h1>

			<p style={{ fontSize: '1rem', color: '#020617' }}>Hola, {name}</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Lamentamos informarte que tu cita programada para el{' '}
				<strong>{capitalize(startAt.toFormat('DDDD'))}</strong> a las{' '}
				<strong>{startAt.toFormat('HH:mm')}</strong> ha sido cancelada por el
				profesional.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Si necesitas más información, puedes comunicarte directamente con el
				profesional o programar una nueva cita desde nuestra plataforma.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Gracias por tu comprensión,
				<br />
				El equipo de MiDoctor
			</p>
		</>
	);
}
