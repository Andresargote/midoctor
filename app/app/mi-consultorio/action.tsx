"use server";

import { createClient } from "@/app/lib/utils/supabase/server";

type Consult = {
	is_online: boolean;
	name: string;
	address: string;
	phone_number: string;
	user_id: string;
};

export async function addConsult(consult: Consult) {
	try {
		const supabase = createClient();

		const { error } = await supabase.from("consults").insert({
			...consult,
		});

		if (error) {
			console.error("Error adding consult:", error, error?.message);
			return {
				error: true,
			};
		}

		return {
			error: null,
		};
	} catch (error) {
		return {
			error: true,
		};
	}
}
