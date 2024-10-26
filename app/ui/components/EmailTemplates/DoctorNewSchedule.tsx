import { capitalize } from '@/app/lib/utils/capitalize';
import { Settings, DateTime } from 'luxon';

type Props = {
	clientName: string;
	professionalName: string;
	startAt: DateTime;
	email: string;
	serviceName: string;
};

Settings.defaultLocale = 'es';

export function DoctorNewScheduleEmail({
	clientName,
	email,
	serviceName,
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
				Te informamos que tienes una nueva cita programada a través de MiDoctor.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				<strong>Detalles de la consulta:</strong>
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Cliente: <strong>{clientName}</strong>
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Correo: <strong>{email}</strong>
			</p>

			{serviceName && (
				<p style={{ fontSize: '1rem', color: '#020617' }}>
					Servicio: <strong>{serviceName}</strong>
				</p>
			)}

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Fecha: <strong>{capitalize(startAt.toFormat('DDDD'))}</strong> a las{' '}
				<strong>{startAt.toFormat('HH:mm')}</strong>
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Por favor, asegúrate de estar preparado/a para recibir a tu paciente en
				el horario indicado. Si tienes alguna duda, no dudes en contactarnos.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				¡Saludos!
				<br />
				El equipo de MiDoctor
			</p>
		</>
	);
}
