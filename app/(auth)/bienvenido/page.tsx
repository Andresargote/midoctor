import { createClient } from '@/app/lib/utils/supabase/server';
import { Confetti } from '@/app/ui/components/Confetti';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Bienvenid@ - MiDoctor',
	description:
		'Bienvenid@ a MiDoctor, una plataforma diseñada para que los profesionales de la salud gestionen fácilmente las citas con sus pacientes, optimizando su agenda y mejorando la experiencia de atención.',
};

export default async function Welcome() {
	const supabase = await createClient();

	const { error, data } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect('/iniciar-sesion');
	}

	return (
		<>
			<Confetti />
			<main className="container z-100 flex flex-col justify-center items-center px-6 mx-auto h-screen">
				<div className="flex flex-col gap-4 max-w-96">
					<h1 className="mb-12 text-3xl font-semibold text-f-black">
						¡Bienvenid@!
					</h1>
					<p className="leading-relaxed text-neutral-500">
						¡Felicidades! {data?.user?.email} Tu cuenta ha sido registrada
						exitosamente en MiDoctor. Estamos emocionados de tenerte en nuestra
						plataforma.
					</p>
					<p className="leading-relaxed text-neutral-500">
						Ahora, dirigete a tu perfil y completalo.
					</p>
					<Link
						href="app/mi-perfil"
						className="p-4 mt-6 font-semibold text-center rounded-full transition duration-300 text-f-white bg-primary-500 hover:bg-primary-600"
					>
						Completar perfil
					</Link>
				</div>
			</main>
		</>
	);
}
