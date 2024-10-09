import { createClient } from '@/app/lib/utils/supabase/server';
import { GeneralWrapper } from '@/app/ui/components/GeneralWrapper';
import { SchedulesList } from '@/app/ui/components/SchedulesList';
import { DateTime } from 'luxon';
import { Suspense } from 'react';

export default async function MisCitasReservadas() {
	const supabase = createClient();

	const { data } = await supabase.auth.getUser();

	const { data: schedules } = await supabase
		.from('schedules')
		.select(
			`
				*,
				service:service_id (name, price, duration, service_id),
				availability:availability_id (timezone, id),
				consult:consult_id (name, address, is_online, id)
			`,
		)
		.eq('professional_id', data?.user?.id);

	const sortedSchedules = schedules?.sort((a, b) => {
		return (
			DateTime.fromISO(a.professional_time.start_at).toMillis() -
			DateTime.fromISO(b.professional_time.start_at).toMillis()
		);
	});

	return (
		<Suspense fallback={<p>Cargando...</p>}>
			<GeneralWrapper
				userId=""
				title="Mis Citas Reservadas"
				description="Aquí puedes ver y gestionar todas tus citas reservadas."
				btnText="Reservar cita"
				data={sortedSchedules ?? []}
				addNewElement={false}
				Content={SchedulesList}
			/>
		</Suspense>
	);
}
