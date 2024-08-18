import { type ComponentProps, forwardRef } from "react";

export type SelectProps = ComponentProps<"select"> & {
	label?: string;
	id: string;
	errorMessage?: string;
	helperText?: string;
	options: {
		value: string;
		label: string;
	}[];
	defaultValue?: string;

	// eslint-disable-next-line no-unused-vars
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{ label, id, errorMessage, helperText, options, defaultValue, ...props },
		ref,
	) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={id} className="text-sm font-light text-neutral-600">
						{label}
					</label>
				)}

				<select
					id={id}
					ref={ref}
					className="flex w-full px-4 transition duration-300 border rounded-full text-f-black min-h-14 border-neutral-300"
					{...props}
				>
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							selected={option.value === defaultValue}
						>
							{option.label}
						</option>
					))}
				</select>

				{helperText && (
					<small className="text-xs font-light text-neutral-600">
						{helperText}
					</small>
				)}

				{errorMessage && (
					<span className="text-xs font-semibold text-error-500 font-xs">
						{errorMessage}
					</span>
				)}
			</div>
		);
	},
);

Select.displayName = "Select";

export default Select;
