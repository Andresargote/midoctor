import type { UserProfile } from '@/app/lib/types';
import { createClient } from '@/app/lib/utils/supabase/server';
import { ProfileForm } from '@/app/ui/components/Forms/ProfileForm';
import * as Switch from '@radix-ui/react-switch';
import type { PostgrestError } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Envelope } from 'react-bootstrap-icons';

export const metadata: Metadata = {
	title: 'Mi perfil - MiDoctor',
	description: 'Aquí puedes ver y editar la información de tu perfil.',
};

export default async function MiPerfil() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	const {
		data: profile,
		error: profileError,
	}: {
		data: UserProfile | null;
		error: PostgrestError | null;
	} = await supabase
		.from('profiles')
		.select()
		.eq('id', data?.user?.id)
		.single();

	if (error || !data?.user) {
		redirect('/iniciar-sesion');
	}

	return (
		<main className="px-4 py-6 mx-auto">
			<div className="container flex flex-col items-center mx-auto lg:pl-72 ">
				<div className="w-full max-w-xl">
					<h1 className="mb-2 text-3xl font-semibold text-neutral-900">
						Perfil
					</h1>
					<p className="mb-6 font-light leading-relaxed text-neutral-800 ">
						Aquí puedes ver y editar la información de tu perfil.
					</p>

					<div className="w-full px-4 py-6 mb-6 rounded-lg shadow-sm bg-f-white">
						<ProfileForm
							profile={profile}
							profileError={!!profileError}
							email={data?.user?.email ?? ''}
						/>
					</div>

					<h2 className="mb-2 text-2xl font-semibold text-neutral-900">
						Preferencias de notificación
					</h2>
					<p className="mb-6 font-light leading-relaxed text-neutral-800">
						Cómo te gustaría recibir notificaciones cuando alguien agende una
						cita contigo?
					</p>

					<div className="w-full px-4 py-6 mb-6 rounded-lg shadow-sm bg-f-white">
						<div className="flex items-center justify-between">
							<label
								htmlFor="email"
								className="flex items-center gap-4 text-sm text-f-black"
							>
								<Envelope color="#0A0A0A" width={24} height={24} />
								Email
							</label>
							<Switch.Root id="email" className="SwitchRoot" checked>
								<Switch.Thumb className="SwitchThumb" />
							</Switch.Root>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
