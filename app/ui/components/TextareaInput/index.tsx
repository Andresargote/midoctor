import { ComponentProps, forwardRef } from 'react';

type TextareaInputProps = ComponentProps<'textarea'> & {
  label: string;
  id: string;
  errorMessage: string;
};

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, id, errorMessage, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-light text-neutral-600">
          {label}
        </label>
        <textarea
          id={id}
          className="w-full px-4 py-2 border rounded-xl border-neutral-300 text-f-black"
          rows={4}
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

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
