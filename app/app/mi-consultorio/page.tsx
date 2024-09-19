import { createClient } from '@/app/lib/utils/supabase/server';
import { ConsultsList } from '@/app/ui/components/ConsultsList';
import { GeneralWrapper } from '@/app/ui/components/GeneralWrapper';
import { AddConsult } from '@/app/ui/components/Modals/AddConsult';
import { Suspense } from 'react';

export default async function MiConsultorio() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const consults = await supabase
    .from('consults')
    .select('*')
    .eq('user_id', data?.user?.id);

  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <GeneralWrapper
        userId={data?.user?.id ?? ''}
        title='Mi consultorio'
        description='Aquí puedes ver y editar la información de tu consultorio.'
        btnText='Agregar consultorio'
        showAddBtn={consults?.data ? consults?.data?.length > 0 : false}
        data={consults.data ?? []}
        AddModal={AddConsult}
        Content={ConsultsList}
      />
    </Suspense>
  );
}
