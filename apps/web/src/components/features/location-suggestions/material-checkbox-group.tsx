'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const MATERIAL_OPTIONS = [
  { label: 'Batteries', value: 'batteries' },
  { label: 'Metals', value: 'metals' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Appliances', value: 'appliances' },
  { label: 'Glass', value: 'glass' },
  { label: 'Paper & Cardboard', value: 'paper-cardboard' },
  { label: 'Plastic', value: 'plastic' },
  { label: 'Rubber / Tires', value: 'rubber-tires' },
  { label: 'Ink Cartridges', value: 'ink-cartridges' },
  { label: 'Wood / Lumber', value: 'wood-lumber' },
  { label: 'Oils / Hazardous Waste', value: 'oils-hazardous-waste' },
  { label: 'Industrial Waste', value: 'industrial-waste' },
  { label: 'Mixed Recyclables', value: 'mixed-recyclables' },
  { label: 'Others', value: 'others' },
] as const;

export type MaterialOptionValue = (typeof MATERIAL_OPTIONS)[number]['value'];

type MaterialCheckboxGroupProps = {
  selectedValues: string[];
  otherValue: string;
  onSelectedValuesChange: (values: string[]) => void;
  onOtherValueChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export function MaterialCheckboxGroup({
  selectedValues,
  otherValue,
  onSelectedValuesChange,
  onOtherValueChange,
  disabled = false,
  error = false,
}: MaterialCheckboxGroupProps) {
  const hasOthersSelected = selectedValues.includes('others');

  function handleCheckedChange(materialValue: string, checked: boolean) {
    if (checked) {
      onSelectedValuesChange(
        selectedValues.includes(materialValue)
          ? selectedValues
          : [...selectedValues, materialValue],
      );
      return;
    }

    const nextValues = selectedValues.filter(
      (value) => value !== materialValue,
    );
    onSelectedValuesChange(nextValues);

    if (materialValue === 'others') {
      onOtherValueChange('');
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'grid grid-cols-1 gap-3 md:grid-cols-2',
          error && 'border-destructive/20 rounded-lg border p-3',
        )}
      >
        {MATERIAL_OPTIONS.map((option) => {
          const isChecked = selectedValues.includes(option.value);

          return (
            <label
              key={option.value}
              htmlFor={`material-${option.value}`}
              className={cn(
                'border-border bg-background flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition',
                'hover:border-ring',
                disabled && 'cursor-not-allowed opacity-70',
              )}
            >
              <Checkbox
                id={`material-${option.value}`}
                checked={isChecked}
                onChange={(e) =>
                  handleCheckedChange(option.value, e.target.checked)
                }
                disabled={disabled}
                className="mt-0.5"
              />

              <div className="min-w-0">
                <p className="text-foreground text-sm font-medium">
                  {option.label}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {hasOthersSelected ? (
        <Input
          id="materials_other"
          name="materials_other"
          label="Please specify other materials. Separate materials with a comma (,)."
          value={otherValue}
          onChange={(e) => onOtherValueChange(e.target.value)}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
