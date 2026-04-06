'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ActiveMaterialType } from '@/modules/admin-material-types';

type UseActiveMaterialTypesReturn = {
  materialTypes: ActiveMaterialType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useActiveMaterialTypes(): UseActiveMaterialTypesReturn {
  const [materialTypes, setMaterialTypes] = useState<ActiveMaterialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterialTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get('/api/v1/admin/material-types/all');

      setMaterialTypes(response.data.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch active material types.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMaterialTypes();
  }, [fetchMaterialTypes]);

  return {
    materialTypes,
    isLoading,
    error,
    refetch: fetchMaterialTypes,
  };
}
