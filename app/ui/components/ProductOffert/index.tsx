import { Bell, CalendarDate, Clock, Person } from 'react-bootstrap-icons';
import Balancer from 'react-wrap-balancer';

export function ProductOffert() {
	const PRODUCT_OFFERT_LIST = [
		{
			title: 'Página de Perfil Profesional',
			description:
				'Crea y personaliza una página donde los pacientes puedan reservar citas directamente contigo.',
			icon: <span className="text-4xl">👤</span>,
		},
		{
			title: 'Reservas de Citas en Línea',
			description:
				'Facilita a tus pacientes la posibilidad de ver tu disponibilidad y reservar citas de forma rápida y sencilla.',
			icon: <span className="text-4xl">📅</span>,
		},
		{
			title: 'Gestión de Agenda',
			description:
				'Organiza y ajusta tu horario de atención según tus necesidades para optimizar tus consultas.',
			icon: <span className="text-4xl">⏰</span>,
		},
		{
			title: 'Notificaciones Automatizadas',
			description:
				'Mantente en contacto con tus pacientes a través de recordatorios y confirmaciones automáticas.',
			icon: <span className="text-4xl">🔔</span>,
		},
	];

	return (
		<section className="max-w-screen-lg mx-auto px-4 py-6 mb-6">
			<ul className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-4">
				{PRODUCT_OFFERT_LIST.map((p, i) => (
					<li
						key={i}
						className="flex flex-col gap-4 items-center bg-f-white py-4 px-2"
					>
						{p.icon}
						<h2 className="font-bold text-neutral-900 text-1xl text-center">
							{p.title}
						</h2>
						<p className="leading-relaxed text-neutral-500 mb-6 text-center">
							<Balancer>{p.description} </Balancer>
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
