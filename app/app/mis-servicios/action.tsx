"use server";

import type { Service as ServiceType } from "@/app/lib/types";
import { createClient } from "@/app/lib/utils/supabase/server";

type Service = {
	name: string;
	price: string;
	duration: {
		hours: string;
		minutes: string;
	};
	user_id: string;
};

export async function addService(service: Service): Promise<{
	error: boolean | null;
	data?: ServiceType;
}> {
	try {
		const supabase = createClient();

		const convertPriceToCents = (price: string) => {
			if (price === "0") return 0;

			const priceToNumber = Number.parseFloat(price);
			const priceInCents = priceToNumber * 100;

			return priceInCents;
		};

		const newService = {
			owner_id: service.user_id,
			name: service.name,
			price: convertPriceToCents(service.price),
			duration: {
				hours: Number.parseInt(service.duration.hours),
				minutes: Number.parseInt(service.duration.minutes),
			},
		};

		const { data, error } = await supabase
			.from("services")
			.insert({
				...newService,
			})
			.select();

		if (error) {
			console.error("Error adding service:", error, error?.message);
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
