import { createClient } from '@/app/lib/utils/supabase/server';
import { Button } from '@/app/ui/components/Button';
import TextInput from '@/app/ui/components/TextInput';
import { TextareaInput } from '@/app/ui/components/TextareaInput';
import { UploadAvatar } from '@/app/ui/components/UploadAvatar';
import { redirect } from 'next/navigation';
import { Envelope } from 'react-bootstrap-icons';
import * as Switch from '@radix-ui/react-switch';

export default async function MiPerfil() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

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
          <p className="mb-6 font-light text-neutral-800">
            Aquí puedes ver y editar la información de tu perfil.
          </p>

          <div className="w-full px-4 py-6 mb-6 rounded-lg bg-f-white">
            <form className="flex flex-col gap-4">
              <UploadAvatar />
              <TextInput label="Nombre de usuario" id="user-name" />
              <TextInput label="Nombre completo" id="full-name" />
              <TextareaInput
                label="Sobre mí"
                id="about-me"
                placeholder="Escribe algo sobre ti"
              />
              <Button type="submit">Guardar cambios</Button>
            </form>
          </div>

          <h2 className="mb-2 text-2xl font-semibold text-neutral-900">
            Preferencias de notificación
          </h2>
          <p className="mb-6 font-light text-neutral-800">
            Cómo te gustaría recibir notificaciones cuando alguien agende una
            cita contigo?
          </p>

          <div className="w-full px-4 py-6 mb-6 rounded-lg bg-f-white">
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
