'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
	BoxArrowUpRight,
	Briefcase,
	Clock,
	Hospital,
	List,
	Wallet2,
	X,
} from 'react-bootstrap-icons';
import Logo from '../../icons/Logo';

type AppNavProps = {
	username: string;
};

export function AppNav({ username }: AppNavProps) {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const currentPath = usePathname();

	const navLinks = [
		{
			title: 'Mi Consultorio',
			href: '/app/mi-consultorio',
			icon: (
				<Hospital color="#0A0A0A" width={20} height={20} className="mr-6" />
			),
			isVisible: true,
			newTab: false,
		},
		{
			title: 'Mis Servicios',
			href: '/app/mis-servicios',
			icon: (
				<Briefcase color="#0A0A0A" width={20} height={20} className="mr-6" />
			),
			isVisible: true,
			newTab: false,
		},
		{
			title: 'Mi Disponibilidad',
			href: '/app/mi-disponibilidad',
			icon: <Clock color="#0A0A0A" width={20} height={20} className="mr-6" />,
			isVisible: true,
			newTab: false,
		} /*,
		{
			title: "Mi Calendario",
			href: "/",
			icon: (
				<Calendar color="#0A0A0A" width={20} height={20} className="mr-6" />
			),
		},
		{
			title: "Mis Pacientes",
			href: "/",
			icon: <People color="#0A0A0A" width={20} height={20} className="mr-6" />,
		},*/,
		{
			title: 'Citas Reservadas',
			href: '/app/mis-citas-reservadas',
			icon: <Wallet2 color="#0A0A0A" width={20} height={20} className="mr-6" />,
			isVisible: true,
			newTab: false,
		},
		{
			title: 'Ver página pública',
			href: `/profesional/${username}`,
			icon: (
				<BoxArrowUpRight
					color="#0A0A0A"
					width={20}
					height={20}
					className="mr-6"
				/>
			),
			newTab: true,
			isVisible: username ? true : false,
		},
	];

	const handleNavToggle = () => {
		setIsNavOpen(!isNavOpen);
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleNavToggle}
				className="p-3 transition duration-300 rounded-full w-fit hover:bg-f-white focused-btn lg:hidden"
				aria-label="Abrir menú de navegación"
				aria-expanded={isNavOpen}
				aria-controls="nav-menu"
			>
				<List color="#0A0A0A" width={24} height={24} />
			</button>

			<button
				type="button"
				onClick={handleNavToggle}
				className={clsx(
					'absolute z-50 p-3 transition duration-300 w-fit bg-f-white focused-btn lg:hidden rounded-r-lg left-[288px] top-1',
					isNavOpen ? 'block' : 'hidden',
				)}
				aria-label="Cerrar menú de navegación"
				aria-controls="nav-menu"
			>
				<X color="#0A0A0A" width={24} height={24} />
			</button>

			<div
				className={clsx(
					'fixed top-0 left-0 z-40 w-full h-full bg-f-black opacity-15 lg:hidden',
					isNavOpen ? 'block' : 'hidden',
				)}
			/>

			<div
				className={clsx(
					'fixed top-0 left-0 z-50 h-full px-3 py-2 bg-f-white w-72 lg:block',
					isNavOpen ? 'block' : 'hidden',
				)}
				id="nav-menu"
			>
				<div className="hidden p-3 mb-4 lg:block">
					<Link href="/app">
						<Logo
							width={144}
							color="#1FBEB8"
							role="img"
							aria-label="MiDoctor"
						/>
						<p className="sr-only">MiDoctor</p>
					</Link>
				</div>
				<nav aria-label="Menú principal">
					<ul className="flex flex-col gap-1">
						{navLinks.map(link =>
							link.isVisible ? (
								<li
									key={link.href}
									className={clsx(
										`p-3 transition duration-300 rounded-full text-neutral-900 ${
											currentPath === link.href
												? 'bg-neutral-100'
												: 'hover:bg-neutral-100'
										} `,
									)}
								>
									<Link
										href={link.href}
										className="flex items-center"
										target={link.newTab ? '_blank' : '_self'}
									>
										{link.icon}
										{link.title}
									</Link>
								</li>
							) : null,
						)}
					</ul>
				</nav>
			</div>
		</div>
	);
}
