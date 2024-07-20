import { AddConsulting } from "@/app/ui/components/AddConsulting";

export default async function MiConsultorio() {
	return (
		<main className="px-4 py-6 mx-auto">
			<div className="container mx-auto lg:pl-72">
				<header className="flex flex-col justify-between w-full gap-6 md:flex-row">
					<div>
						<h1 className="mb-2 text-3xl font-semibold text-neutral-900">
							Mi Consultorio
						</h1>
						<p className="font-light leading-relaxed text-neutral-800">
							Aquí puedes ver y editar la información de tu consultorio.
						</p>
					</div>

					<div className="w-fit">
						<AddConsulting />
					</div>
				</header>
			</div>
		</main>
	);
}
