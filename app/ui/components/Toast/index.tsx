import clsx from 'clsx';
import { useEffect, useState } from 'react';

export type ToastProps = {
	type?: 'success' | 'error';
	message: string;
};

type ToastType = ToastProps & {
	id: number;
};

// Todo: This is a simple toast component, you can improve it by adding more features like:
// - Add a close button
// - Manage multiple toasts
// - Add animation
export function Toast({ type = 'success', message }: ToastProps) {
	const [toats, setToats] = useState<ToastType[]>([
		{
			id: new Date().getTime(),
			type: type,
			message: message,
		},
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setToats([]);
		}, 5000); // 5 seconds

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<>
			{toats.map(t => (
				<div
					key={t.id}
					className={clsx(
						'max-w-96 fixed top-0 right-0 p-4 m-4 rounded-xl',
						t.type === 'success' ? 'bg-success-100' : 'bg-error-100',
					)}
					style={{
						zIndex: 9999,
					}}
					role="alert"
				>
					<p className="text-f-black">{t.message}</p>
				</div>
			))}
		</>
	);
}
