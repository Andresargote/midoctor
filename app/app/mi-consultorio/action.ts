'use server';

import type { Consult as ConsultType } from '@/app/lib/types';
import { createClient } from '@/app/lib/utils/supabase/server';

type Consult = {
  is_online: boolean;
  name: string;
  address: string;
  phone_number: string;
  user_id: string;
};

export async function addConsult(consult: Consult): Promise<{
  error: boolean | null;
  data?: ConsultType;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('consults')
      .insert({
        ...consult,
      })
      .select();

    if (error) {
      console.error('Error adding consult:', error, error?.message);
      return {
        error: true,
      };
    }

    return {
      error: null,
      data: data[0],
    };
  } catch (error) {
    return {
      error: true,
    };
  }
}
