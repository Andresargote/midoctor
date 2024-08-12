import { createClient } from "@/app/lib/utils/supabase/server";
import { AddConsult } from "@/app/ui/components/AddConsult";
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
						<div className="w-fit">
							<AddConsult userId={data?.user?.id ?? ""} />
						</div>
					)}
				</header>
				<Suspense fallback={<div>Cargando...</div>}>
					{consults.data?.length === 0 ? (
						<p className="text-lg font-light text-center text-neutral-800">
							Aún no tienes consultorios registrados
						</p>
					) : (
						<main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
							{consults.data?.map((consult) => (
								<div
									key={consult.id}
									className="h-full p-4 rounded-lg shadow-sm bg-f-white"
								>
									<h2 className="mb-2 text-xl font-semibold text-neutral-900">
										{consult.name}
									</h2>
									<div className="p-2 rounded-full w-fit bg-neutral-100">
										<p className="text-xs font-base text-neutral-900">
											{consult.is_online
												? "Consulta virtual"
												: "Consulta presencial"}
										</p>
									</div>
									{consult.address && (
										<p className="mt-4 text-sm font-light leading-relaxed text-neutral-800">
											{consult.address}
										</p>
									)}
								</div>
							))}
						</main>
					)}
				</Suspense>
			</div>
		</div>
	);
}
