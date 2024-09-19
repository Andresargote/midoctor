import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../Button";
import { X } from "react-bootstrap-icons";

type Props = {
	visible: boolean;
	handleCloseModal: (accept: boolean) => void;
	loading: boolean;
	serviceName?: string;
};

export function DeleteServiceModal({
	visible,
	handleCloseModal,
	loading,
	serviceName,
}: Props) {
	return (
		<Dialog.Root open={visible}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed top-0 left-0 z-50 w-full h-full bg-f-black opacity-15" />

				<Dialog.Content
					aria-disabled={loading}
					onInteractOutside={() => {
						if (!loading) {
							handleCloseModal(false);
						}
					}}
					onEscapeKeyDown={() => {
						if (!loading) {
							handleCloseModal(false);
						}
					}}
					className="fixed z-50 w-full max-w-md p-8 transform shadow-sm bg-f-white rounded-2xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
					style={{
						transform: "translate(-50%, -50%)",
						width: "calc(100% - 1rem)",
					}}
					onOpenAutoFocus={(event) => {
						event.preventDefault();
					}}
				>
					<Dialog.Title className="max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900">
						¿Eliminar consultorio?
					</Dialog.Title>
					<Dialog.Description className="mb-6 text-sm font-light leading-relaxed text-neutral-800">
						<strong>¡Esta acción no tiene vuelta atrás!</strong>
						<br />
						¿Seguro que quieres eliminar el consultorio{" "}
						<strong className="font-bold">{serviceName}</strong>?
					</Dialog.Description>

					<div className="flex items-center justify-end gap-3">
						<Dialog.Close asChild>
							<Button
								bgColorKey="neutral"
								type="button"
								disabled={loading}
								onClick={() => {
									if (!loading) {
										handleCloseModal(false);
									}
								}}
							>
								Cancelar
							</Button>
						</Dialog.Close>
						<Button
							bgColorKey="error"
							type="button"
							isLoading={loading}
							disabled={loading}
							onMouseDown={() => handleCloseModal(true)}
						>
							Eliminar
						</Button>
					</div>
					<button
						onClick={() => {
							if (!loading) {
								handleCloseModal(false);
							}
						}}
						type="button"
						className="absolute p-2 rounded-full focused-btn top-4 right-4 bg-neutral-100"
						aria-label="Cerrar modal de eliminar consultorio"
					>
						<X color="#0A0A0A" width={24} height={24} />
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
