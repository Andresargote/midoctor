'use client';

import { useEffect, useState } from 'react';
import ConfettiComponent from 'react-confetti';

export function Confetti() {
	const [vWidth, setVWidth] = useState(0);
	const [vHeight, setVHeight] = useState(0);
	const [confettiPieces, setConfettiPieces] = useState(200);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> No need
	useEffect(() => {
		if (vHeight === 0) setVHeight(window.innerHeight);
		if (vWidth === 0) setVWidth(window.innerWidth);

		addEventListener('resize', () => {
			setVWidth(window.innerWidth);
			setVHeight(window.innerHeight);
		});

		return () => {
			removeEventListener('resize', () => {
				setVWidth(window.innerWidth);
				setVHeight(window.innerHeight);
			});
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setConfettiPieces(0);
		}, 1500);
	}, []);

	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full ">
			<ConfettiComponent
				width={vWidth}
				height={vHeight}
				numberOfPieces={confettiPieces}
			/>
		</div>
	);
}
