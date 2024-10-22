import { DateTime } from 'luxon';

type Props = {
	name: string;
	startAt: DateTime;
};

export function DoctorCanceledSchedule({ name, startAt }: Props) {
	return (
		<>
			<h1 style={{ color: '#1FBEB8' }}>MiDoctor</h1>

			<p style={{ fontSize: '1rem', color: '#020617' }}>Hola, {name}</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Te informamos que tu reserva del {startAt.toISO()} ha sida cancelada por
				el profesional.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				Para mas información comunícate directamente con el profesional o agenda
				una nueva reserva.
			</p>

			<p style={{ fontSize: '1rem', color: '#020617' }}>
				¡Saludos!
				<br />
				El equipo de MiDoctor
			</p>
		</>
	);
}
