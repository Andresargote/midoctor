import clsx from "clsx";
import type { ComponentProps } from "react";
import { Loader } from "../Loader";

export type ButtonProps = ComponentProps<"button"> & {
	isLoading?: boolean;
	children: React.ReactNode;
	bgColorKey?: "neutral" | "primary" | "success" | "error";
};

const buttonColors: { [key: string]: string[] } = {
	neutral: ["bg-neutral-300", "bg-neutral-900 hover:bg-neutral-950"],
	primary: ["bg-primary-200", "bg-primary-500 hover:bg-primary-600"],
	success: ["bg-success-200", "bg-success-500 hover:bg-success-600"],
	error: ["bg-error-200", "bg-error-500 hover:bg-error-600"],
};

export function Button({
	isLoading = false,
	bgColorKey = "primary",
	...props
}) {
	const bgColorClass = buttonColors[bgColorKey] || buttonColors.primary;

	return (
		<button
			className={clsx(
				"focused-btn px-4 font-semibold rounded-full min-h-14 text-f-white",
				props?.disabled
					? `${bgColorClass[0]}`
					: `${bgColorClass[1]} transition duration-300`,
				props.className,
			)}
			{...props}
		>
			{isLoading && <Loader />}
			{props.children}
		</button>
	);
}
