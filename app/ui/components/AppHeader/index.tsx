'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { BoxArrowInLeft, Person } from 'react-bootstrap-icons';
import { AppNav } from '../AppNav';
import Logo from '../../icons/Logo';
import { signOut } from '@/app/(home)/action';
import { useState } from 'react';
import { Loader } from '../Loader';
import { Toast } from '../Toast';
import { Avatar } from '../Avatar';
import { UserProfile } from '@/app/lib/types';

export function AppHeader({ profile }: { profile: UserProfile | null }) {
  const [signOutError, setSignOutError] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

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
            <AppNav />
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

          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <button
                className="rounded-full w-11 h-11 bg-primary-500 text-f-white"
                aria-label="Abrir opciones de usuario"
              >
                <Avatar profile={profile} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="flex flex-col gap-1 absolute right-[-24px] px-3 py-2 mt-2 rounded bg-f-white min-w-60">
                <DropdownMenu.Item
                  onSelect={(event) => {
                    console.log('event', event);
                    console.log('event', event);
                  }}
                  className="transition duration-300 rounded-full hover:bg-neutral-100"
                >
                  <Link
                    className="flex items-center w-full p-3 text-neutral-900"
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
                  onSelect={(event) => event.preventDefault()}
                  className="transition duration-300 rounded-full hover:bg-error-50"
                >
                  <button
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
