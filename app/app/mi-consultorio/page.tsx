import { createClient } from "@/app/lib/utils/supabase/server";
import { ConsultsList } from "@/app/ui/components/ConsultsList";
import Link from "next/link";
import { Suspense } from "react";

export default async function MiConsultorio() {
	const supabase = createClient();

	const { data } = await supabase.auth.getUser();

	const consults = await supabase
		.from("consults")
		.select("*")
		.eq("user_id", data?.user?.id);

	return (
		<div className="px-4 py-6 mx-auto">
			<div className="container mx-auto lg:pl-72">
				<header className="flex flex-col justify-between w-full gap-6 mb-12 md:flex-row">
					<div>
						<h1 className="mb-2 text-3xl font-semibold text-neutral-900">
							Mi Consultorio
						</h1>
						<p className="font-light leading-relaxed text-neutral-800">
							Aquí puedes ver y editar la información de tu consultorio.
						</p>
					</div>

					{consults.data?.length === 0 && (
						<div>
							<Link
								className="flex flex-col justify-center px-4 font-semibold transition duration-300 rounded-full w-fit bg-primary-500 hover:bg-primary-600 focused-btn min-h-14 text-f-white"
								href="mi-consultorio/?action=new"
							>
								Agregar consultorio
							</Link>
						</div>
					)}
				</header>
				<Suspense fallback={<div>Cargando...</div>}>
					<ConsultsList
						userId={data?.user?.id ?? ""}
						consultsData={consults.data ?? []}
					/>
				</Suspense>
			</div>
		</div>
	);
}
