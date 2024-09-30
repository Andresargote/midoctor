import { createClient } from '@/app/lib/utils/supabase/server';
import { ScheduleForm } from '@/app/ui/components/ScheduleForm';
import Logo from '@/app/ui/icons/Logo';
import Image from 'next/image';
import { GeoAlt, Telephone } from 'react-bootstrap-icons';
import { Balancer } from 'react-wrap-balancer';

/**
TODO:
	- redirect to 404 if profesional not found
	- add skeleton loading
 */

export default async function Profesional({
	params,
}: {
	params: {
		username: string;
	};
}) {
	const { username } = params;
	const supabase = createClient();

	const { data } = await supabase
		.from('profiles')
		.select('*')
		.eq('username', username);

	const profesional = data ? data[0] : {};

	const { data: consultData } = await supabase
		.from('consults')
		.select('*')
		.eq('user_id', profesional?.id);

	const consult = consultData ? consultData[0] : {};

	const { data: services } = await supabase
		.from('services')
		.select('*')
		.eq('user_id', profesional?.id);

	function centsToDolar(quantity: number) {
		return quantity / 100;
	}

	function calcDuration(hours: number, minutes: number) {
		let hoursAndMinutes = '';

		if (hours) {
			hoursAndMinutes += `${hours} ${hours !== 1 ? 'horas' : 'hora'}`;

			if (minutes) {
				hoursAndMinutes += ` y ${minutes} ${minutes !== 1 ? 'minutos' : 'minutos'}`;
			}

			return hoursAndMinutes;
		}

		if (minutes) {
			hoursAndMinutes += `${minutes} ${minutes !== 1 ? 'minutos' : 'minutos'}`;

			return hoursAndMinutes;
		}
	}

	const { data: availabilityData } = await supabase
		.from('availabilities')
		.select('*')
		.eq('user_id', profesional?.id);

	const availability = availabilityData ? availabilityData[0] : null;

	return (
		<>
			<header className="px-4 py-6">
				<div className="m-auto max-w-screen-lg">
					<Logo width={144} color="#1FBEB8" role="img" aria-label="MiDoctor" />
				</div>
			</header>
			<main className="px-4 pt-8 pb-6 m-auto max-w-screen-lg">
				<div className="grid grid-cols-1 m-auto md:grid-cols-2">
					<section className="flex flex-col gap-6 px-4 py-6 shadow-sm bg-f-white rounded-t-3xl md:rounded-t-none md:!rounded-l-3xl md:min-h-[632px]">
						<div className="flex gap-4 items-center">
							{profesional?.avatar_url && (
								<Image
									alt={`Foto de perfil de ${profesional?.full_name}`}
									src={profesional?.avatar_url}
									width={88}
									height={88}
									className="object-cover rounded-full"
								/>
							)}

							{profesional?.full_name && (
								<h1 className="text-xl font-semibold text-neutral-900">
									{profesional.full_name}
								</h1>
							)}
						</div>
						{profesional?.about_me && (
							<p className="leading-relaxed text-neutral-500">
								<Balancer>{profesional?.about_me}</Balancer>
							</p>
						)}

						{services && services?.length > 0 && (
							<div>
								<h2 className="mb-3 text-sm font-semibold text-neutral-900">
									Mis servicios y precios
								</h2>
								<ul className="flex flex-col">
									{services.map(service => (
										<li
											key={service.service_id}
											className="flex items-center justify-between border-b-[1px] border-neutral-200 pb-2"
										>
											<div>
												<h3 className="text-sm font-medium text-neutral-900">
													{service.name}
												</h3>

												{service?.duration && (
													<span className="text-xs text-neutral-500">
														Duración:{' '}
														{calcDuration(
															service?.duration.hours,
															service?.duration.minutes,
														)}
													</span>
												)}
											</div>
											<span className="font-medium text-neutral-900">
												${centsToDolar(service.price)}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{consult && !consult.is_online && (
							<div className="flex flex-col">
								<h2 className="mb-3 text-sm font-medium font-semibold text-neutral-900">
									Información de consulta
								</h2>
								<address className="flex gap-2 items-center mb-2 text-sm not-italic font-light text-neutral-500">
									{<GeoAlt />} {consult?.address}
								</address>
								<address className="flex gap-2 items-center text-sm not-italic font-light text-neutral-500">
									{<Telephone />} {consult?.phone_number}
								</address>
							</div>
						)}
					</section>
					<aside className="flex flex-col gap-6 px-4 py-6 shadow-sm bg-f-gray rounded-b-3xl md:rounded-b-none md:!rounded-r-3xl min-h-[432px] md:min-h-[632px] ">
						<ScheduleForm
							services={services ?? []}
							availability={availability}
							isOnline={consult?.is_online}
						/>
					</aside>
				</div>
			</main>
		</>
	);
}
