import Link from 'next/link';
import Logo from '../../icons/Logo';

export function Header() {
	return (
		<header className="mb-12 md:mb-24">
			<div className="px-4 py-6 flex max-w-screen-lg mx-auto flex-col gap-4 justify-start md:flex-row md:justify-between md:items-center">
				<Logo width={144} color="#1FBEB8" role="img" aria-label="MiDoctor" />
				<nav>
					<ul className="flex items-center gap-4 flex-wrap">
						<li>
							<Link
								href="/iniciar-sesion"
								className="text-f-black text-neutral-800 hover:text-neutral-900 hover:underline transition duration-300 focused-btn "
							>
								Iniciar sesión
							</Link>
						</li>
						<li>
							<Link
								href="/crear-cuenta"
								className="focused-btn font-semibold rounded-full  text-f-white bg-primary-500 hover:bg-primary-600 py-2 px-4 transition duration-300"
							>
								Crear cuenta
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
