import { DateTime } from 'luxon';

type Props = {
	name: string;
	professionalName: string;
	address: string;
	phoneNumber: string;
	serviceName: string;
	startAt: DateTime;
};

export function ScheduleReminder({
	name,
	professionalName,
	address,
	phoneNumber,
	serviceName,
	startAt,
}: Props) {
	return (
		<>
			<h1 style={{ color: '#1FBEB8' }}>MiDoctor</h1>

			<p style={{ fontSize: '1rem', color: '#020617' }}>Hola, {name}</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Este es un recordatorio de tu próxima consulta programada con{' '}
				<strong>{professionalName}</strong> para el servicio de{' '}
				<strong>{serviceName}</strong> a través de MiDoctor.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Tu consulta es el día <strong>{startAt.toFormat('dddd')}</strong> a las{' '}
				<strong>{startAt.toFormat('HH:mm')}</strong>.
			</p>

			{address && (
				<p style={{ fontSize: '1rem', color: '#020617' }}>
					La consulta se realizará en la siguiente dirección:{' '}
					<strong>{address}</strong>.
				</p>
			)}

			{phoneNumber && (
				<p style={{ fontSize: '1rem', color: '#020617' }}>
					Para cualquier duda o consulta, puedes contactar al consultorio al
					siguiente número: <strong>{phoneNumber}</strong>.
				</p>
			)}

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Te recomendamos estar unos minutos antes de la hora programada. Si
				tienes alguna duda, no dudes en contactarnos.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				¡Saludos!
				<br />
				El equipo de MiDoctor
			</p>
		</>
	);
}
