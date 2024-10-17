import { Metadata } from 'next';
import Balancer from 'react-wrap-balancer';

export const metadata: Metadata = {
	title: 'App - MiDoctor',
	description:
		'MiDoctor es una plataforma diseñada para que los profesionales de la salud gestionen fácilmente las citas con sus pacientes, optimizando su agenda y mejorando la experiencia de atención.',
};

export default async function App() {
	return (
		<p className="text-lg font-light text-center text-neutral-800">
			<Balancer>
				¡Ups! Estamos trabajando en esta página 👷🏽‍♂️. ¡Pronto estará lista!
			</Balancer>
		</p>
	);
}
