'use client';

import { ChangeEvent } from 'react';

import { Switch } from '@/components/ui/switch';

type MaterialTypeStatusToggleProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export function MaterialTypeStatusToggle({
  checked,
  onChange,
  disabled,
}: MaterialTypeStatusToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
      <span className="text-sm">{checked ? 'Active' : 'Inactive'}</span>
    </div>
  );
}
