import { createClient } from '@/app/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MiPerfil() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/iniciar-sesion');
  }
  return <div>Perfil de usuario: {data.user.email}</div>;
}
