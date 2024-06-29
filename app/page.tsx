import { signOut } from './(home)/action';
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
      <form action={signOut} className="flex flex-col gap-4 prose">
        <button className="btn btn-primary">Log out</button>
      </form>
    </main>
  );
}
