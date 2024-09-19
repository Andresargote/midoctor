"use server";
import { SUPABASE_TABLES } from "@/app/lib/shared/supabase_tables";
import { createClient } from "@/app/lib/utils/supabase/server";

type ServiceId = string;

export async function deleteService(serviceId: ServiceId) {
	try {
		const supabase = createClient();

		const { error } = await supabase
			.from(SUPABASE_TABLES.SERICES)
			.delete()
			.eq("service_id", serviceId);

		if (error) {
			return { error: true };
		}

		return { error: null };
	} catch (error) {
		return { error: true };
	}
}
