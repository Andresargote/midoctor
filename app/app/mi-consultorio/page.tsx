import { createClient } from '@/app/lib/utils/supabase/server';
import { ConsultsList } from '@/app/ui/components/ConsultsList';
import { GeneralWrapper } from '@/app/ui/components/GeneralWrapper';
import { AddConsult } from '@/app/ui/components/Modals/AddConsult';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Mi consultorio - MiDoctor',
	description: 'Aquí puedes ver y gestionar tu consultorio.',
};

export default async function MiConsultorio() {
	const supabase = await createClient();

	const { data } = await supabase.auth.getUser();

	const consults = await supabase
		.from('consults')
		.select('*')
		.eq('user_id', data?.user?.id);

	return (
		<Suspense fallback={<p>Cargando...</p>}>
			<GeneralWrapper
				userId={data?.user?.id ?? ''}
				title="Mi consultorio"
				description="Aquí puedes ver y editar la información de tu consultorio."
				btnText="Agregar consultorio"
				conditionalShowBtn={true}
				data={consults.data ?? []}
				AddModal={AddConsult}
				Content={ConsultsList}
			/>
		</Suspense>
	);
}
