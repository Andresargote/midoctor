import { createClient } from './lib/utils/supabase/server';

export default async function Home() {
	const supabase = createClient();

	const { data } = await supabase.auth.getUser();

	return (
		<main>
			<p className="text-3xl font-bold underline text-primary-500">
				Telemedicine super app
				{data?.user?.email}
			</p>
		</main>
	);
}
