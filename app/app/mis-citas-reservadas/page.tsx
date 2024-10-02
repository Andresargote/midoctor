import { createClient } from '@/app/lib/utils/supabase/server';
import { SchedulesList } from '@/app/ui/components/SchedulesList';

export default async function MisCitasReservadas() {
	const supabase = createClient();

	const { data } = await supabase.auth.getUser();

	const { data: schedules } = await supabase
		.from('schedules')
		.select(
			`
				*,
				services:service_id (name, price, duration),
				availabilities:availability_id (timezone)
			`,
		)
		.eq('profesional_id', data?.user?.id);

	console.log(schedules);

	return (
		<div className="px-4 py-6 mx-auto">
			<div className="container mx-auto lg:pl-72">
				<header className="flex flex-col justify-between w-full gap-6 mb-12 md:flex-row">
					<div>
						<h1 className="mb-2 text-3xl font-semibold text-neutral-900">
							Mis Citas Reservadas
						</h1>
						<p className="font-light leading-relaxed text-neutral-800">
							Aquí puedes ver y gestionar todas tus citas reservadas.
						</p>
					</div>
				</header>
				<main>
					{schedules?.length === 0 ? (
						<p className="text-lg font-light text-center text-neutral-800">
							Aún no tienes citas reservadas
						</p>
					) : (
						<SchedulesList schedules={schedules ?? []} />
					)}
				</main>
			</div>
		</div>
	);
}
