import type { MaterialType } from '@/modules/material-types/types/material-type.types';

export function withOtherMaterialOption(
  materialTypes: MaterialType[] = [],
): MaterialType[] {
  return [
    ...materialTypes,
    {
      name: 'Others',
      slug: 'others',
      description: 'Specify materials not listed above.',
    },
  ];
}
