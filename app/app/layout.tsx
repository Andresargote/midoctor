import type { PostgrestError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import type { UserProfile } from '../lib/types';
import { createClient } from '../lib/utils/supabase/server';
import { AppHeader } from '../ui/components/AppHeader';

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	const {
		data: profile,
		error: profileError,
	}: {
		data: UserProfile | null;
		error: PostgrestError | null;
	} = await supabase
		.from('profiles')
		.select()
		.eq('id', data?.user?.id)
		.maybeSingle();

	if (error || !data?.user) {
		redirect('/iniciar-sesion');
	}

	if (profileError) {
		console.error('Error fetching profile', profileError);
	}

	return (
		<html lang="es">
			<body>
				<AppHeader profile={profile} />
				{children}
			</body>
		</html>
	);
}
