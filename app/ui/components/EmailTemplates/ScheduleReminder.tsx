import { DateTime } from 'luxon';

type Props = {
	name: string;
	startAt: DateTime;
};

export function ScheduleReminder({ name, startAt }: Props) {
	return (
		<div>
			<p>Hola, {name}</p>
			<br />
			<p>
				Este es un recordatorio de tu próxima consulta en MiDoctor. Estamos aquí
				para asegurarnos de que estés listo para tu cita.
			</p>
			<br />
			<p>
				Tu consulta empieza mañana <strong>{startAt.toISODate()}</strong> a las{' '}
				<strong>{startAt.toFormat('HH:mm')}</strong>
			</p>

			<p>
				Te recomendamos estar unos minutos antes de tu cita. Saludos, el equipo
				de MiDoctor.
			</p>
		</div>
	);
}
