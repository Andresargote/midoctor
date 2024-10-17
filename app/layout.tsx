import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './ui/styles/globals.css';

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'MiDoctor - Gestiona fácilmente tus citas con tus pacientes',
	description:
		'MiDoctor es una plataforma diseñada para que los profesionales de la salud gestionen fácilmente las citas con sus pacientes, optimizando su agenda y mejorando la experiencia de atención.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={poppins.className}>{children}</body>
		</html>
	);
}
