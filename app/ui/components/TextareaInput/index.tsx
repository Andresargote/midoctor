import { ComponentProps } from 'react';

type TextareaInputProps = ComponentProps<'textarea'> & {
  label: string;
  id: string;
  errorMessage: string;
};

export function TextareaInput({
  label,
  id,
  errorMessage,
  ...props
}: TextareaInputProps) {
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
      />
      {errorMessage && (
        <span className="text-xs font-semibold text-error-500 font-xs">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
