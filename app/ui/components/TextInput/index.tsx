import { ComponentProps, forwardRef } from 'react';

export type TextInputProps = ComponentProps<'input'> & {
  label: string;
  id: string;
  errorMessage: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, id, errorMessage, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-light text-neutral-600">
          {label}
        </label>
        <input
          id={id}
          className="flex w-full px-4 transition duration-300 border rounded-full f-black min-h-14 border-neutral-300"
          {...props}
          ref={ref}
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

TextInput.displayName = 'TextInput';

export default TextInput;
