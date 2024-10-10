import Balancer from 'react-wrap-balancer';

export default function NotFound() {
	return (
		<div className="flex flex-col gap-4 justify-center items-center h-screen mx-auto max-w-128 text-center">
			<h1 className="text-3xl font-semibold text-neutral-900">
				<Balancer>¡Ups! Parece que no encontramos lo que buscabas</Balancer>
			</h1>
			<p className="leading-relaxed text-sm text-neutral-500">
				Si el error persiste, por favor contacta con{' '}
				{/*Todo: change the email address */}
				<a href="mailto:test@gmail.com" className="underline text-primary-500">
					soporte
				</a>
			</p>
		</div>
	);
}
