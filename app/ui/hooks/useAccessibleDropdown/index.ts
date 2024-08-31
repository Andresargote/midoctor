/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';

type Props = {
  options: Array<{ value: string; label: string }>;
  value: string | null;
  onChange: (value: string) => void;
  namespace: string;
};

export function useAccesibleDropdown({ options, value, onChange, namespace }: Props) {
  const [isDropdownOpen, setIsDropdownOpenInternal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  const listContainerRef = useRef<HTMLUListElement>(null);

  const select = (value: string) => {
    if (value) {
      onChange && onChange(value);
    }

    setIsDropdownOpen(false);
  };

  const setIsDropdownOpen = (v: boolean) => {
    if (v) {
      const selected = options.findIndex((o) => o.value === value);
      setActiveIndex(selected < 0 ? 0 : selected);
    }

    setIsDropdownOpenInternal(v);
  };

  const registerClosedDropdownHandlers = ({
    setIsDropdownOpen,
  }: {
    setIsDropdownOpen: (v: boolean) => void;
  }) => {
    const keyDownCallback = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
        case ' ': // Space
        case 'Enter':
          e.preventDefault();
          setIsDropdownOpen(true);
      }
    };
    document.addEventListener('keydown', keyDownCallback);
    return () => {
      document.removeEventListener('keydown', keyDownCallback);
    };
  };

  const handlePositionScrollWithKeyboard = () => {
    if (listContainerRef.current) {
      const activeElement =
        listContainerRef.current.querySelector(`[aria-selected="true"]`);
      if (activeElement) {
        const dropdownRect = listContainerRef.current.getBoundingClientRect();
        const activeElementRect = activeElement.getBoundingClientRect();

        if (activeElementRect.bottom > dropdownRect.bottom) {
          listContainerRef.current!.scrollTop +=
            activeElementRect.bottom - dropdownRect.bottom;
        } else if (activeElementRect.top < dropdownRect.top) {
          listContainerRef.current!.scrollTop -= dropdownRect.top - activeElementRect.top;
        }
      }
    }
  };

  const registerOpenDropdownHandlers = ({
    optionsLength,
    activeIndex,
    setActiveIndex,
    select,
    namespace,
  }: {
    optionsLength: number;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    select: (value: string) => void;
    namespace: string;
  }) => {
    const keyDownCallback = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(activeIndex <= 0 ? optionsLength - 1 : activeIndex - 1);
          return;
        case 'Down':
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(activeIndex + 1 === optionsLength ? 0 : activeIndex + 1);
          return;
        case 'Enter':
        case ' ': // Space
          e.preventDefault();
          select(options[activeIndex].value);
          return;
        case 'Esc':
        case 'Escape':
          e.preventDefault();
          select('');
          return;
        case 'PageUp':
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          return;
        case 'PageDown':
        case 'End':
          e.preventDefault();
          setActiveIndex(options.length - 1);
          return;
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !e
          .composedPath()
          .find(
            (e) =>
              (e as HTMLElement).dataset &&
              (e as HTMLElement).dataset.namespace === namespace + '-dropdown-root'
          )
      ) {
        // Did not found in path, closing
        e.preventDefault();
        select('');
      }
    };

    document.addEventListener('keydown', keyDownCallback);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', keyDownCallback);
      document.removeEventListener('click', onClick);
    };
  };

  useEffect(() => {
    if (isDropdownOpen) {
      return registerOpenDropdownHandlers({
        activeIndex,
        setActiveIndex,
        optionsLength: options.length,
        select,
        namespace,
      });
    }

    if (isFocus) {
      return registerClosedDropdownHandlers({
        setIsDropdownOpen,
      });
    }
  }, [isDropdownOpen, activeIndex, isFocus]);

  useEffect(() => {
    if (isDropdownOpen && listContainerRef.current) {
      handlePositionScrollWithKeyboard();
    }
  }, [activeIndex, isDropdownOpen]);

  return {
    listContainerRef,
    isDropdownOpen,
    setIsDropdownOpen,
    activeIndex,
    setActiveIndex,
    select,
    setIsFocus,
  };
}
