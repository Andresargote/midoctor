'use server';
import { createClient } from '@/app/lib/utils/supabase/server';
import type { UserFormDefaultValues } from '@/app/ui/components/Forms/ProfileForm';

type ProfileFormValues = UserFormDefaultValues & {
	id: string;
	email: string;
};

export async function updateProfile(profile: ProfileFormValues) {
	try {
		const supabase = await createClient();

		const { error } = await supabase.from('profiles').upsert(profile);

		if (error) {
			console.error('Error updating profile:', error, error.message);
			return { error: true };
		}

		return { error: null };
	} catch (error) {
		console.error(error);
		return { error: true };
	}
}
