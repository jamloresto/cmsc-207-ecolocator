import type { AdminMaterialTypesListParams } from '@/modules/admin-material-types';

export function buildMaterialTypesQueryParams(
  params: AdminMaterialTypesListParams,
): string {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.per_page) searchParams.set('per_page', String(params.per_page));
  if (params.search?.trim()) searchParams.set('search', params.search.trim());
  if (params.is_active !== undefined && params.is_active !== '') {
    searchParams.set('is_active', params.is_active);
  }
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.direction) searchParams.set('direction', params.direction);

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}
