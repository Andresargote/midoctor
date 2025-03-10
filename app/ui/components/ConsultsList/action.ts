'use server';
import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { createClient } from '@/app/lib/utils/supabase/server';

type ConsultId = string;

export async function deleteConsult(consultId: ConsultId) {
	try {
		const supabase = await createClient();

		console.log(consultId);

		const { data, error, status } = await supabase
			.from(SUPABASE_TABLES.CONSULTS)
			.delete()
			.eq('id', Number(consultId));

		console.log(`Data: ${data}`, `Error: ${error}`, `Status: ${status}`);

		if (error) {
			console.error('Error deleting consult', error, error.message);
			return { error: true };
		}

		return { error: null };
	} catch (error) {
		console.error(error);
		return { error: true };
	}
}
