'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getAdminMaterialTypes,
  updateAdminMaterialTypeStatus,
  type AdminMaterialType,
  type AdminMaterialTypesListParams,
  type LaravelPaginatedResponse,
} from '@/modules/admin-material-types';

type UseAdminMaterialTypesReturn = {
  materialTypes: AdminMaterialType[];
  pagination: LaravelPaginatedResponse<AdminMaterialType> | null;
  isLoading: boolean;
  error: string | null;
  params: AdminMaterialTypesListParams;
  setParams: React.Dispatch<React.SetStateAction<AdminMaterialTypesListParams>>;
  refetch: () => Promise<void>;
  handleStatusToggle: (materialType: AdminMaterialType) => Promise<void>;
};

export function useAdminMaterialTypes(): UseAdminMaterialTypesReturn {
  const [materialTypes, setMaterialTypes] = useState<AdminMaterialType[]>([]);
  const [pagination, setPagination] =
    useState<LaravelPaginatedResponse<AdminMaterialType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [params, setParams] = useState<AdminMaterialTypesListParams>({
    page: 1,
    per_page: 10,
    search: '',
    is_active: '',
    sort: 'name',
    direction: 'asc',
  });

  const fetchMaterialTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAdminMaterialTypes(params);

      setMaterialTypes(response.data.data);
      setPagination(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch material types.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchMaterialTypes();
  }, [fetchMaterialTypes]);

  const handleStatusToggle = useCallback(
    async (materialType: AdminMaterialType) => {
      await updateAdminMaterialTypeStatus(materialType.id, {
        is_active: !materialType.is_active,
      });

      await fetchMaterialTypes();
    },
    [fetchMaterialTypes],
  );

  return {
    materialTypes,
    pagination,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchMaterialTypes,
    handleStatusToggle,
  };
}
