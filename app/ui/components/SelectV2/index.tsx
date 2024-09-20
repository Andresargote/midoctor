import clsx from 'clsx';
import { useAccesibleDropdown } from '../../hooks/useAccessibleDropdown';
import { Check, ChevronDown } from 'react-bootstrap-icons';

type SelectV2Props = {
  value: string | null;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  namespace?: string;
  label?: string;
  id?: string;
};

export function SelectV2({
  value,
  options,
  onChange,
  namespace = 'default_select_namespace',
  label = '',
  id = '',
}: SelectV2Props) {
  const {
    listContainerRef,
    isDropdownOpen,
    setIsDropdownOpen,
    activeIndex,
    setActiveIndex,
    select,
    setIsFocus,
  } = useAccesibleDropdown({
    options,
    value,
    onChange,
    namespace,
  });

  const chosen = options.find((o) => o.value === value);

  return (
    <div id={`${namespace}-dropdown-root`} className='relative h-full'>
      <button
        role='combobox'
        value='Select'
        aria-label={label}
        aria-autocomplete='none'
        aria-controls={`${namespace}_dropdown`}
        aria-haspopup='listbox'
        aria-expanded={isDropdownOpen}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className='flex justify-between items-center px-4 py-2 w-full h-full rounded-full border transition duration-300 bg-f-white text-f-black border-neutral-300 focused-btn'
        id={id}
      >
        {chosen?.label || label}
        <ChevronDown color='#0A0A0A' />
      </button>
      {isDropdownOpen && (
        <ul
          role='listbox'
          id={`${namespace}_dropdown`}
          className={clsx(
            isDropdownOpen
              ? 'overflow-y-auto absolute z-50 mt-2 w-full max-h-60 list-none rounded-lg border bg-f-white border-neutral-300 shadow-xs'
              : 'overflow-hidden w-0 h-0'
          )}
          tabIndex={-1}
          ref={listContainerRef}
        >
          {options?.map((option, index) => (
            <li
              key={option.value}
              id={`${namespace}_element_${option.value}`}
              role='option'
              onMouseOver={() => setActiveIndex(index)}
              onClick={() => select(option.value)}
              aria-selected={index === activeIndex}
              className={clsx(index === activeIndex && 'bg-neutral-100')}
            >
              <label
                className={clsx(
                  'flex w-full px-2 py-2 transition-all cursor-pointer',
                  chosen?.value === option.value && 'bg-neutral-100'
                )}
              >
                <input
                  name={`${namespace}_radio`}
                  type='radio'
                  onChange={() => select(option.value)}
                  checked={chosen?.value === option.value}
                  value={option.value}
                  className='overflow-hidden p-0 m-0 w-0 h-0 opacity-0'
                />
                <div className='flex justify-between items-center w-full'>
                  <span>{option.label}</span>
                  {chosen?.value === option.value && (
                    <Check className='w-5 h-5 text-primary-500' />
                  )}
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
