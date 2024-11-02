import Link from 'next/link';
import Balancer from 'react-wrap-balancer';

export function Hero() {
	return (
		<main className="mb-6">
			<div className="max-w-screen-lg mx-auto px-4 py-6">
				<div>
					<h1 className="text-4xl font-bold text-neutral-900 mb-6 leading-[120%] tracking-[-0.75px]">
						<Balancer>
							Optimiza tu tiempo y mejora la atención a tus pacientes
						</Balancer>
					</h1>
					<p className="leading-relaxed text-neutral-600 mb-6">
						<Balancer>
							MiDoctor te permite gestionar tus citas de forma simple y
							eficiente. Diseñada para profesionales de la salud, nuestra
							plataforma facilita la programación de citas y el seguimiento de
							pacientes, ayudándote a optimizar tu agenda y brindar una
							experiencia de atención excepcional.
						</Balancer>
					</p>
					<div className="flex gap-4 items-center flex-wrap">
						<Link
							href="/crear-cuenta"
							className="focused-btn font-semibold rounded-full text-f-white bg-primary-800 hover:bg-primary-600 py-2 px-4 transition duration-300"
						>
							Comenzar ahora
						</Link>
						<Link
							href="/profesional/demo"
							className="focused-btn font-semibold rounded-full text-f-white bg-f-black py-2 px-4 "
						>
							Ver demo
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
