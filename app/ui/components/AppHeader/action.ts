'use server';

import { createClient } from '@/app/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error('Error logging out:', error, error?.message);
		return { error: true };
	}

	redirect('/');
}
