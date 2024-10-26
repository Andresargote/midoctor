import { capitalize } from '@/app/lib/utils/capitalize';
import { Settings, DateTime } from 'luxon';

type Props = {
	professionalName: string;
	clientName: string;
	serviceName: string;
	address: string;
	phoneNumber: string;
	startAt: DateTime;
};

Settings.defaultLocale = 'es';

export function ClientNewScheduleEmail({
	professionalName,
	clientName,
	serviceName,
	address,
	phoneNumber,
	startAt,
}: Props) {
	return (
		<>
			<h1 style={{ color: '#1FBEB8' }}>MiDoctor</h1>

			<p style={{ fontSize: '1rem', color: '#020617' }}>Hola, {clientName}</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				¡Tu cita ha sido reservada con éxito!
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				<strong>Detalles de tu cita:</strong>
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Profesional: {professionalName}
			</p>
			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Fecha: <strong>{capitalize(startAt.toFormat('DDDD'))}</strong> a las{' '}
				<strong>{startAt.toFormat('HH:mm')}</strong>
			</p>

			{serviceName && (
				<p style={{ fontSize: '1rem', color: '#020617' }}>
					Servicio: {serviceName}
				</p>
			)}

			{address && (
				<p style={{ fontSize: '1rem', color: '#020617' }}>
					Dirección: {address}
				</p>
			)}

			{phoneNumber && (
				<p style={{ fontSize: '1rem', color: '#020617' }}>
					Teléfono del profesional/consultorio: {phoneNumber}
				</p>
			)}

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Si tienes alguna pregunta o necesitas realizar algún cambio en tu cita,
				no dudes en contactarnos.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				¡Saludos!
				<br />
				El equipo de MiDoctor
			</p>
		</>
	);
}
