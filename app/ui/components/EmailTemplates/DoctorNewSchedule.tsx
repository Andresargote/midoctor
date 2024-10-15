import { DateTime } from 'luxon';

type Props = {
	clientName: string;
	professionalName: string;
	startAt: DateTime;
	email: string;
};

export function DoctorNewScheduleEmail({
	clientName,
	email,
	professionalName,
	startAt,
}: Props) {
	return (
		<>
			<h1 style={{ color: '#1FBEB8' }}>MiDoctor</h1>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Hola, {professionalName}
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Una nueva consulta ha sido programada
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				<strong>Detalles de la cita:</strong>
			</p>
			<p>Cliente: {clientName}</p>
			<p>Correo: {email}</p>
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
