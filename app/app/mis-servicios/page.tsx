import { createClient } from '@/app/lib/utils/supabase/server';
import { GeneralWrapper } from '@/app/ui/components/GeneralWrapper';
import { AddService } from '@/app/ui/components/Modals/AddService';
import { ServicesList } from '@/app/ui/components/ServicesList';
import { Metadata } from 'next';

import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Mis servicios - MiDoctor',
	description: 'Aquí puedes ver y editar la información de tus servicios.',
};

export default async function MisServicios() {
	const supabase = createClient();

	const { data } = await supabase.auth.getUser();

	const services = await supabase
		.from('services')
		.select('*')
		.eq('user_id', data?.user?.id);

	return (
		<Suspense fallback={<p>Cargando...</p>}>
			<GeneralWrapper
				userId={data?.user?.id ?? ''}
				title="Mis Servicios"
				description="Aquí puedes ver y editar la información de tus servicios."
				btnText="Agregar servicio"
				data={services.data ?? []}
				AddModal={AddService}
				Content={ServicesList}
			/>
		</Suspense>
	);
}
