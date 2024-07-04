'use server';
import { createClient } from '@/app/lib/utils/supabase/server';
import { UserFormDefaultValues } from '@/app/ui/components/Forms/ProfileForm';

type ProfileFormValues = UserFormDefaultValues & {
  id: string;
};

export async function updateProfile(profile: ProfileFormValues) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from('profiles').upsert(profile);

    console.log(data);

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
