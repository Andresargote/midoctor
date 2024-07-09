import clsx from "clsx";
import type { ComponentProps } from "react";
import { Loader } from "../Loader";

export type ButtonProps = ComponentProps<"button"> & {
	isLoading?: boolean;
	children: React.ReactNode;
};

// Todo: Add loading
export function Button({ isLoading = false, ...props }) {
	return (
		<button
			className={clsx(
				"focused-btn px-4 font-semibold rounded-full min-h-14 text-f-white",
				props?.disabled
					? "bg-primary-100"
					: "bg-primary-500 hover:bg-primary-600 transition duration-300",
				props.className,
			)}
			{...props}
		>
			{isLoading && <Loader />}
			{props.children}
		</button>
	);
}
