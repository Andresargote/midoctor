import clsx from "clsx";
import type { ElementType } from "react";

export type ProviderProps = {
	text: string;
	icon: ElementType;
	disabled?: boolean;
};

export function Provider({
	text,
	icon: Icon,
	disabled = false,
}: ProviderProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			className={clsx(
				"w-full font-semibold text-f-black flex min-h-14 items-center justify-center gap-2.5 px-4 rounded-full border border-neutral-300 transition duration-300",
				disabled ? "bg-neutral-100" : "hover:bg-neutral-50",
			)}
			aria-label="Botón para acceder con Google"
		>
			<Icon width={24} />
			{text}
		</button>
	);
}
