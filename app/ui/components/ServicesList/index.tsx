'use client';
import type { Service } from '@/app/lib/types';
import { useEffect, useState } from 'react';
import { ServiceCard } from './service';
import { DeleteServiceModal } from './deleteModal';
import { deleteService } from './action';
import { Toast } from '../Toast';

export function ServicesList({ data }: { data: Service[] }) {
	const [services, setServices] = useState(data ?? []);
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [deleteModal, setDeleteModal] = useState({
		visible: false,
	});

	const [state, setState] = useState({
		loading: false,
		infoMessage: '',
		errorMessage: '',
		successMessage: '',
	});

	const handleOpenDeleteModal = (service: Service) => {
		setSelectedService(service);
		setDeleteModal({ visible: true });
	};

	const handleDeleteService = async (accept: boolean) => {
		if (!accept) {
			setDeleteModal({ visible: false });
			return;
		}

		if (!selectedService) {
			setState(prev => ({
				...prev,
				infoMessage: 'Selecciona un servicio para eliminar',
			}));
			return;
		}

		try {
			setState(prev => ({ ...prev, loading: true }));

			const { error } = await deleteService(selectedService.service_id);

			if (error) {
				throw new Error('Error al eliminar el servicio');
			}

			setServices(prev =>
				prev.filter(s => s.service_id !== selectedService.service_id),
			);
			setState(prev => ({
				...prev,
				successMessage: 'Servicio eliminado exitosamente',
			}));
		} catch (e) {
			setState(prev => ({
				...prev,
				errorMessage: 'Error al eliminar el servicio',
			}));
		} finally {
			setDeleteModal({ visible: false });
			setState(prev => ({ ...prev, loading: false }));
		}
	};

	useEffect(() => {
		setServices(data);
	}, [data]);

	return (
		<>
			{state.errorMessage.length > 0 && (
				<Toast type="error" message={state.errorMessage} />
			)}
			{state.infoMessage.length > 0 && (
				<Toast type="error" message={state.infoMessage} />
			)}
			{state.successMessage.length > 0 && (
				<Toast type="success" message={state.successMessage} />
			)}
			<DeleteServiceModal
				loading={state.loading}
				serviceName={selectedService?.name}
				visible={deleteModal.visible}
				handleCloseModal={handleDeleteService}
			/>
			<main>
				{services.length === 0 ? (
					<p className="text-lg font-light text-center text-neutral-800">
						Aún no tienes servicios registrados
					</p>
				) : (
					<ul className="grid grid-cols-1 gap-6">
						{services.map(service => (
							<ServiceCard
								key={service.service_id}
								service={service}
								openModal={handleOpenDeleteModal}
							/>
						))}
					</ul>
				)}
			</main>
		</>
	);
}
