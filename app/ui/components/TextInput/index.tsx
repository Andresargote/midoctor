import { type ComponentProps, forwardRef } from "react";

export type TextInputProps = ComponentProps<"input"> & {
	label: string;
	id: string;
	errorMessage: string;
	// eslint-disable-next-line no-unused-vars
	handleInputFormatter?: (value: string) => string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ label, id, errorMessage, handleInputFormatter, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				<label htmlFor={id} className="text-sm font-light text-neutral-600">
					{label}
				</label>
				<input
					id={id}
					className="flex w-full px-4 transition duration-300 border rounded-full text-f-black min-h-14 border-neutral-300"
					{...props}
					ref={ref}
					onChange={(e) => {
						if (handleInputFormatter) {
							e.target.value = handleInputFormatter(e.target.value);
						}
						props.onChange?.(e);
					}}
				/>
				{errorMessage && (
					<span className="text-xs font-semibold text-error-500 font-xs">
						{errorMessage}
					</span>
				)}
			</div>
		);
	},
);

TextInput.displayName = "TextInput";

export default TextInput;
