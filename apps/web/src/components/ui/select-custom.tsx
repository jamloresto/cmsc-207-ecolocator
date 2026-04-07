'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type SelectProps = {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SelectCustom({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn('relative w-full', open ? 'z-50' : 'z-0')}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'border-input bg-background text-foreground flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm',
          className,
        )}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          {selected?.icon}
          {selected?.label ?? placeholder}
        </span>

        <ChevronDown
          className={cn(
            'text-muted-foreground h-4 w-4 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="border-border bg-card absolute z-50 mt-2 w-full rounded-2xl border shadow-md">
          <ul className="max-h-60 overflow-auto p-2">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'hover:bg-muted flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                    isSelected && 'bg-muted',
                  )}
                >
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    {option.icon}
                    {option.label}
                  </span>

                  {isSelected && <Check className="text-primary h-4 w-4" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
