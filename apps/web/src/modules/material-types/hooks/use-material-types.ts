'use client';

import * as React from 'react';
import { getMaterialTypes } from '@/modules/material-types/api/material-types.api';
import type { MaterialType } from '@/modules/material-types/types/material-type.types';

export function useMaterialTypes() {
  const [materialTypes, setMaterialTypes] = React.useState<MaterialType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadMaterialTypes() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getMaterialTypes();

        if (!isMounted) return;
        setMaterialTypes(response.data ?? []);
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch material types.',
        );
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadMaterialTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    materialTypes,
    isLoading,
    error,
  };
}
