import { buildDefaultAvailability } from '@/app/lib/utils/buildDefaultAvailability';
import { createClient } from '@/app/lib/utils/supabase/server';

export async function POST(req: Request) {
	const body = await req.json();
	const { record } = body;

	const supabase = createClient();
	const defaultAvailability = buildDefaultAvailability(record.id);
	const data = {
		...defaultAvailability,
		days: JSON.stringify(defaultAvailability.days),
	};
	const { error } = await supabase.from('availability').insert(data);

	console.log('error', error);

	if (error) {
		return Response.json(
			{ error: true, message: 'Ha ocurrido un error' },
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}

	return Response.json(
		{ error: false, message: 'Disponibilidad creada correctamente' },
		{ status: 201, headers: { 'Content-Type': 'application/json' } },
	);
}
