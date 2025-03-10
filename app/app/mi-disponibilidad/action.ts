'use server';
import { Day } from '@/app/lib/types';
import { createClient } from '@/app/lib/utils/supabase/server';

export async function editAvailabilyDays({
	availabilityId,
	days,
}: {
	availabilityId: string;
	days: Day[];
}) {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase
			.from('availabilities')
			.update({
				days,
			})
			.eq('id', availabilityId);

		if (error) {
			console.error('Error editing availability:', error, error?.message);
			return {
				error: true,
			};
		}

		return {
			error: null,
			data: data ? data[0] : [],
		};
	} catch (error) {
		return {
			error: true,
		};
	}
}
