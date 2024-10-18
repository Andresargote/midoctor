import { Schedule } from '@/app/lib/types';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X } from 'react-bootstrap-icons';
import { Button } from '../../Button';

type Props = {
	isOpen: boolean;
	schedule: Schedule;
	handleCloseModal: () => void;
	handleCompleteSchedule: (schedule: Schedule) => Promise<void>;
};

export function CompleteScheduleModal({
	isOpen,
	schedule,
	handleCloseModal,
	handleCompleteSchedule,
}: Props) {
	const [isLoading, setIsLoading] = useState(false);

	const cancelSchedule = async (schedule: Schedule) => {
		setIsLoading(true);
		await handleCompleteSchedule(schedule);
		setIsLoading(false);
		handleCloseModal();
	};

	return (
		<>
			<Dialog.Root open={isOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed top-0 left-0 z-50 w-full h-full bg-f-black opacity-15" />

					<Dialog.Content
						aria-disabled={isLoading}
						onInteractOutside={() => {
							if (!isLoading) {
								handleCloseModal();
							}
						}}
						onEscapeKeyDown={() => {
							if (!isLoading) {
								handleCloseModal();
							}
						}}
						className="fixed z-50 w-full max-w-md p-8 transform shadow-sm bg-f-white rounded-2xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
						style={{
							transform: 'translate(-50%, -50%)',
							width: 'calc(100% - 1rem)',
						}}
						onOpenAutoFocus={event => {
							event.preventDefault();
						}}
					>
						<Dialog.Title className="max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900">
							¿Marcar cita como completada?
						</Dialog.Title>
						<Dialog.Description className="mb-6 text-sm font-light leading-relaxed text-neutral-800">
							<strong>¡Esta acción no se puede deshacer!</strong>
						</Dialog.Description>
						<Dialog.Close asChild>
							<button
								onClick={() => {
									if (!isLoading) {
										handleCloseModal();
									}
								}}
								type="button"
								className="absolute p-2 rounded-full focused-btn top-4 right-4 bg-neutral-100"
								aria-label="Cerrar modal de creación de servicio"
							>
								<X color="#0A0A0A" width={24} height={24} />
							</button>
						</Dialog.Close>
						<div className="flex items-center justify-end gap-3">
							<Dialog.Close asChild>
								<Button
									bgColorKey="neutral"
									type="button"
									disabled={isLoading}
									onClick={() => {
										if (!isLoading) {
											handleCloseModal();
										}
									}}
								>
									Cancelar
								</Button>
							</Dialog.Close>

							<Button
								onClick={() => cancelSchedule(schedule)}
								bgColorKey="success"
								type="submit"
								isLoading={isLoading}
								disabled={isLoading}
								aria-label="Marcar como completada la reserva"
							>
								Aceptar
							</Button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}
