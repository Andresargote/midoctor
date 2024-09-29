import { type ComponentProps, forwardRef } from 'react';
import { CurrencyDollar } from 'react-bootstrap-icons';

export type PriceInputProps = ComponentProps<'input'> & {
	label: string;
	id: string;
	errorMessage?: string;
	helperText?: string;
	// eslint-disable-next-line no-unused-vars
};

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
	({ label, id, errorMessage, helperText, ...props }, ref) => {
		const handleValueFormatter = (value: string) => {
			const isNumber = /^[0-9.,]*$/.test(value);
			if (!isNumber) return '';

			return value;
		};

		return (
			<div className="flex flex-col gap-1.5">
				<label htmlFor={id} className="text-sm font-light text-neutral-600">
					{label}
				</label>

				<div className="flex items-center">
					<div className="flex items-center px-4 border border-r-0 rounded-s-full bg-neutral-100 min-h-14 border-neutral-300">
						<CurrencyDollar color="#0A0A0A" width={24} height={24} />
					</div>
					<input
						id={id}
						className="flex w-full px-4 transition duration-300 border rounded-r-full text-f-black min-h-14 border-neutral-300"
						{...props}
						ref={ref}
						onChange={e => {
							e.target.value = handleValueFormatter(e.target.value);
							props.onChange?.(e);
						}}
					/>
				</div>

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

PriceInput.displayName = 'PriceInput';

export default PriceInput;
