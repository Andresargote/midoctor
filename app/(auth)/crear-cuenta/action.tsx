'use server';

import { createClient } from '@/app/lib/utils/supabase/server';

export async function signUp(email: string) {
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithOtp({
		email,
	});

	if (error) {
		console.error('SignUp error:', error, error?.message);
		return { error: true };
	}

	return { error: null };
}
