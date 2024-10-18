'use client';

import type { UserProfile } from '@/app/lib/types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BoxArrowInLeft, Person } from 'react-bootstrap-icons';
import Logo from '../../icons/Logo';
import { AppNav } from '../AppNav';
import { Avatar } from '../Avatar';
import { Loader } from '../Loader';
import { Toast } from '../Toast';
import { signOut } from './action';

export function AppHeader({ profile }: { profile: UserProfile | null }) {
	const [signOutError, setSignOutError] = useState(false);
	const [isSignOutLoading, setIsSignOutLoading] = useState(false);
	const currentPath = usePathname();
	const handleSignOut = async () => {
		setSignOutError(false);
		try {
			setIsSignOutLoading(true);
			await signOut();
		} catch (error) {
			console.error('Error logging out');
			setSignOutError(true);
		} finally {
			setIsSignOutLoading(false);
		}
	};

	return (
		<>
			<header className="px-4 py-6">
				<div className="container flex items-center justify-between mx-auto">
					<div className="flex items-center gap-4">
						<AppNav username={profile?.username ?? ''} />
						<Link className="flex items-start gap-2 w-fit lg:hidden" href="/">
							<Logo
								width={144}
								color="#1FBEB8"
								role="img"
								aria-label="MiDoctor"
							/>
							<p className="sr-only">MiDoctor</p>
						</Link>
					</div>

					<div className="flex items-center gap-8 flex-wrap">
						{profile?.username && (
							<Link
								href={`/profesional/${profile?.username}`}
								target="_blank"
								className="hidden bg-primary-500 text-f-white rounded-full px-4 py-2 font-semibold text-sm md:flex"
							>
								<span className="text-sm font-semibold text-f-white underline">
									Ver página pública
								</span>
							</Link>
						)}

						<DropdownMenu.Root modal={false}>
							<DropdownMenu.Trigger asChild>
								<button
									type="button"
									className="rounded-full w-11 h-11 bg-primary-500 text-f-white"
									aria-label="Abrir opciones de usuario"
								>
									<Avatar profile={profile} />
								</button>
							</DropdownMenu.Trigger>

							<DropdownMenu.Portal>
								<DropdownMenu.Content className="flex flex-col gap-1 absolute right-[-24px] px-3 py-2 mt-2 rounded bg-f-white min-w-60">
									<DropdownMenu.Item
										onSelect={event => {
											console.log('event', event);
											console.log('event', event);
										}}
										className="transition duration-300 rounded-full hover:bg-neutral-100"
									>
										<Link
											className={clsx(
												'flex items-center w-full p-3 text-neutral-900 rounded-full',
												currentPath === '/app/mi-perfil'
													? 'bg-neutral-100'
													: 'hover:bg-neutral',
											)}
											href="/app/mi-perfil"
										>
											<Person
												color="#0A0A0A"
												className="mr-4"
												width={20}
												height={20}
											/>
											Mi perfil
										</Link>
									</DropdownMenu.Item>
									<DropdownMenu.Separator className="h-[1px] bg-neutral-50" />
									<DropdownMenu.Item
										onSelect={event => event.preventDefault()}
										className="transition duration-300 rounded-full hover:bg-error-50"
									>
										<button
											type="button"
											disabled={isSignOutLoading}
											onClick={handleSignOut}
											className="flex items-center w-full p-3 text-error-500"
										>
											{isSignOutLoading && <Loader />}
											<BoxArrowInLeft
												color="#EF4444"
												className="mr-4"
												width={20}
												height={20}
											/>
											Cerrar sesión
										</button>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>
					</div>
				</div>
			</header>
			{signOutError && (
				<Toast
					message="Ha ocurrido un error al intentar cerrar sesión, por favor intenta de nuevo."
					type="error"
				/>
			)}
		</>
	);
}
