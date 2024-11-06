import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './ui/styles/globals.css';
import { ConsoleASCII } from './ui/components/ConsoleASCII';

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'MiDoctor - Optimiza tu tiempo y mejora la atención a tus pacientes',
	description:
		'MiDoctor te permite gestionar tus citas de forma simple y eficiente. Diseñada para profesionales de la salud, nuestra plataforma facilita la programación de citas y el seguimiento de pacientes, ayudándote a optimizar tu agenda y brindar una experiencia de atención excepcional.',
	openGraph: {
		title: 'MiDoctor - Optimiza tu tiempo y mejora la atención a tus pacientes',
		description:
			'MiDoctor te permite gestionar tus citas de forma simple y eficiente. Diseñada para profesionales de la salud, nuestra plataforma facilita la programación de citas y el seguimiento de pacientes.',
		type: 'website',
		locale: 'es_ES',
		siteName: 'MiDoctor',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'MiDoctor - Optimiza tu tiempo y mejora la atención a tus pacientes',
		description:
			'MiDoctor te permite gestionar tus citas de forma simple y eficiente. Diseñada para profesionales de la salud.',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={poppins.className}>
				{children}

				<ConsoleASCII />
			</body>
		</html>
	);
}
