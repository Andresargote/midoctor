import { redirect } from 'next/navigation';
import { createClient } from '../lib/utils/supabase/server';
import { AppHeader } from '../ui/components/AppHeader';

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
      <body
        style={{
          backgroundColor: '#F1F5F9',
        }}
      >
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
