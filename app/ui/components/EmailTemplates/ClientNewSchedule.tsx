import { DateTime } from 'luxon';

type Props = {
	clientName: string;
	professionalName: string;
	startAt: DateTime;
};

export function ClientNewScheduleEmail({
	professionalName,
	clientName,
	startAt,
}: Props) {
	return (
		<>
			<h1 style={{ color: '#1FBEB8' }}>MiDoctor</h1>

			<p style={{ fontSize: '1rem', color: '#020617' }}>Hola, {clientName}</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Has reservado una nueva cita.
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				<strong>Detalles de la cita:</strong>
			</p>
			<p>Profesional: {professionalName}</p>
			<p>
				Fecha: <strong>{startAt.toFormat('dddd')}</strong> a las{' '}
				<strong>{startAt.toFormat('HH:mm')}</strong>
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				¡Saludos!
				<br />
				El equipo de MiDoctor
			</p>
		</>
	);
}
