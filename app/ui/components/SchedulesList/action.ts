'use server';
import { ScheduleStatus } from '@/app/lib/scheduleStatus';
import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { createClient } from '@/app/lib/utils/supabase/server';
//import { revalidatePath } from 'next/cache';

export async function cancelScheduleAction(scheduleId: number) {
	const supabase = createClient();

	const { error } = await supabase
		.from(SUPABASE_TABLES.SCHEDULES)
		.update({
			status: ScheduleStatus.CANCELLED,
		})
		.match({ id: scheduleId });

	//revalidatePath('/app/mis-citas-reservadas', 'page');

	return { error: !!error };
}
