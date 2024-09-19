import type { Service } from "@/app/lib/types";
import { Trash3 } from "react-bootstrap-icons";

type Props = {
	service: Service;
	openModal: (service: Service) => void;
};

export function ServiceCard({ service, openModal }: Props) {
	return (
		<li
			key={service.service_id}
			className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-f-white"
		>
			<div>
				<h3 className="text-lg font-semibold text-neutral-900">
					{service.name}
				</h3>
				<p className="text-sm font-light text-neutral-800">
					{service.duration.hours} horas {service.duration.minutes} minutos
				</p>
			</div>
			<div className="flex items-center gap-2 align-middle">
				<p className="text-lg font-semibold text-neutral-900">
					${service.price / 100}
				</p>
				<button
					onClick={() => openModal(service)}
					type="button"
					className="flex items-center justify-center w-8 h-8 transition duration-300 rounded-md hover:bg-error-50 focused-btn"
					aria-label="Botón para eliminar consultorio"
				>
					<Trash3 color="#EF4444" />
				</button>
			</div>
		</li>
	);
}
