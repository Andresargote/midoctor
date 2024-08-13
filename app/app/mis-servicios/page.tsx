import { ServicesList } from "@/app/ui/components/ServicesList";
import Link from "next/link";

export default async function MisServicios() {
	return (
		<div className="px-4 py-6 mx-auto">
			<div className="container mx-auto lg:pl-72">
				<header className="flex flex-col justify-between w-full gap-6 mb-12 md:flex-row">
					<div>
						<h1 className="mb-2 text-3xl font-semibold text-neutral-900">
							Mis Servicios
						</h1>
						<p className="font-light leading-relaxed text-neutral-800">
							Aquí puedes ver y editar la información de tus servicios.
						</p>
					</div>
					<div>
						<Link
							className="flex flex-col justify-center px-4 font-semibold transition duration-300 rounded-full w-fit bg-primary-500 hover:bg-primary-600 focused-btn min-h-14 text-f-white"
							href="mis-servicios/?action=new"
						>
							Agregar servicio
						</Link>
					</div>
				</header>
				<main>
					<ServicesList />
				</main>
			</div>
		</div>
	);
}
