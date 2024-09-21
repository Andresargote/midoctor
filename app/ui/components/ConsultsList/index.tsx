'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash3, X } from 'react-bootstrap-icons';
import { Button } from '../Button';
import 'react-phone-number-input/style.css';
import type { Consult } from '@/app/lib/types';
import { useEffect, useState } from 'react';
import { Toast } from '../Toast';
import { deleteConsult } from './action';

export function ConsultsList({ data }: { data: Consult[] }) {
	const [consults, setConsults] = useState<Consult[]>(data ?? []);
	const [selectedConsult, setSelectedConsult] = useState<Consult | null>(null);
	const [deleted, setDeleted] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleCloseDeleteModal = () => {
		setIsOpen(false);
		setSelectedConsult(null);
	};

	const handleDeleteConsult = async (consultId: string) => {
		setIsLoading(true);
		setError(null);
		setDeleted('');
		try {
			await deleteConsult(consultId);

			setConsults(prev => prev.filter(c => c.id !== consultId));
			setDeleted('Consultorio eliminado exitosamente');
		} catch (e) {
			setError(
				'Ocurrió un error al intentar eliminar el consultorio, por favor intenta de nuevo, si el problema persiste contacta con soporte.',
			);
		} finally {
			setIsLoading(false);

			handleCloseDeleteModal();
		}
	};

	useEffect(() => {
		setConsults(data);
	}, [data]);

	return (
		<>
			<Dialog.Root open={isOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed top-0 left-0 z-50 w-full h-full bg-f-black opacity-15" />

					<Dialog.Content
						aria-disabled={isLoading}
						onInteractOutside={() => {
							if (!isLoading) {
								handleCloseDeleteModal();
							}
						}}
						onEscapeKeyDown={() => {
							if (!isLoading) {
								handleCloseDeleteModal();
							}
						}}
						className="fixed top-2/4 left-2/4 z-50 p-8 w-full max-w-md rounded-2xl shadow-sm transform -translate-x-2/4 -translate-y-2/4 bg-f-white"
						style={{
							transform: 'translate(-50%, -50%)',
							width: 'calc(100% - 1rem)',
						}}
						onOpenAutoFocus={event => {
							event.preventDefault();
						}}
					>
						<Dialog.Title className="max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900">
							¿Eliminar consultorio?
						</Dialog.Title>
						<Dialog.Description className="mb-6 text-sm font-light leading-relaxed text-neutral-800">
							<strong>¡Esta acción no tiene vuelta atrás!</strong>
							<br />
							¿Seguro que quieres eliminar el consultorio{' '}
							<strong className="font-bold">{selectedConsult?.name}</strong>?
						</Dialog.Description>

						<div className="flex gap-3 justify-end items-center">
							<Dialog.Close asChild>
								<Button
									bgColorKey="neutral"
									type="button"
									disabled={isLoading}
									onClick={() => {
										if (!isLoading) {
											handleCloseDeleteModal();
										}
									}}
								>
									Cancelar
								</Button>
							</Dialog.Close>
							<Button
								bgColorKey="error"
								type="button"
								isLoading={isLoading}
								disabled={isLoading}
								onMouseDown={() =>
									handleDeleteConsult(selectedConsult?.id ?? '')
								}
							>
								Eliminar
							</Button>
						</div>
						<button
							onClick={() => {
								if (!isLoading) {
									handleCloseDeleteModal();
								}
							}}
							type="button"
							className="absolute top-4 right-4 p-2 rounded-full focused-btn bg-neutral-100"
							aria-label="Cerrar modal de eliminar consultorio"
						>
							<X color="#0A0A0A" width={24} height={24} />
						</button>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
			{error && <Toast type="error" message={error} />}
			{deleted && <Toast type="success" message={deleted} />}
			{consults.length === 0 ? (
				<p className="text-lg font-light text-center text-neutral-800">
					Aún no tienes consultorios registrados
				</p>
			) : (
				<main className="grid grid-cols-1 auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
					{consults?.map(consult => (
						<div
							key={consult.id}
							className="p-4 h-full rounded-lg shadow-sm bg-f-white"
						>
							<div className="flex justify-between">
								<h2 className="mb-2 text-xl font-semibold text-neutral-900">
									{consult.name}
								</h2>

								<button
									onClick={() => {
										setSelectedConsult(consult);
										setIsOpen(true);
									}}
									type="button"
									className="flex justify-center items-center w-8 h-8 rounded-md transition duration-300 hover:bg-error-50 focused-btn"
									aria-label="Botón para eliminar consultorio"
								>
									<Trash3 color="#EF4444" />
								</button>
							</div>
							<div className="p-2 rounded-full w-fit bg-neutral-100">
								<p className="text-xs font-base text-neutral-900">
									{consult.is_online
										? 'Consulta virtual'
										: 'Consulta presencial'}
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
		</>
	);
}
