import { redirect } from 'next/navigation';
import { createClient } from '../lib/utils/supabase/server';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/iniciar-sesion');
  }

  return (
    <html lang="es">
      <body>
        <p>App layout</p>
        {children}
      </body>
    </html>
  );
}
