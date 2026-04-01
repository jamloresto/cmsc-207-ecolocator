'use client';

import * as React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { MaterialType, withOtherMaterialOption } from '@/modules/material-types';


type MaterialCheckboxGroupProps = {
  options?: MaterialType[];
  selectedValues: string[];
  otherValue: string;
  onSelectedValuesChange: (values: string[]) => void;
  onOtherValueChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export function MaterialCheckboxGroup({
  options = [],
  selectedValues,
  otherValue,
  onSelectedValuesChange,
  onOtherValueChange,
  disabled = false,
  error = false,
}: MaterialCheckboxGroupProps) {
  const hasOthersSelected = selectedValues.includes('others');

  const materialOptions = React.useMemo(
    () => withOtherMaterialOption(options),
    [options],
  );

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
        {materialOptions.map((option) => {
          const isChecked = selectedValues.includes(option.slug);

          return (
            <label
              key={option.slug}
              htmlFor={`material-${option.slug}`}
              className={cn(
                'border-border bg-background flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition',
                'hover:border-ring',
                disabled && 'cursor-not-allowed opacity-70',
              )}
            >
              <Checkbox
                id={`material-${option.slug}`}
                checked={isChecked}
                onChange={(e) =>
                  handleCheckedChange(option.slug, e.target.checked)
                }
                disabled={disabled}
                className="mt-0.5"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-foreground text-sm font-medium">
                    {option.name}
                  </p>

                  {option.description ? (
                    <span
                      className="text-muted-foreground cursor-help text-xs"
                      title={option.description}
                    >
                      ⓘ
                    </span>
                  ) : null}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {hasOthersSelected ? (
        <Input
          id="materials_other"
          name="materials_other"
          label="Please specify other materials"
          value={otherValue}
          onChange={(e) => onOtherValueChange(e.target.value)}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
