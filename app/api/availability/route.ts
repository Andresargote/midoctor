import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { buildDefaultAvailability } from '@/app/lib/utils/buildDefaultAvailability';
import { createClient } from '@/app/lib/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { record } = body;

	const supabase = createClient();
	const defaultAvailability = buildDefaultAvailability(record.id);

	const { error } = await supabase.from(SUPABASE_TABLES.AVIABILITY).insert({
		...defaultAvailability,
		days: defaultAvailability.days,
	});

	console.log('error webhook', error);

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
