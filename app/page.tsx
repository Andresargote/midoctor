import { Footer } from './ui/components/Footer';
import { Header } from './ui/components/Header';
import { Hero } from './ui/components/Hero';
import { ProductOffert } from './ui/components/ProductOffert';

export default async function Home() {
	return (
		<>
			<Header />
			<Hero />
			<ProductOffert />
			<Footer />
		</>
	);
}
