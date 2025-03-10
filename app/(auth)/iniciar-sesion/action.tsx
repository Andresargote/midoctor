'use server';

import { createClient } from '@/app/lib/utils/supabase/server';

export async function signIn(email: string) {
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithOtp({
		email,
	});

	if (error) {
		console.error('Error logging in:', error, error?.message);
		return { error: true };
	}

	return { error: null };
}
