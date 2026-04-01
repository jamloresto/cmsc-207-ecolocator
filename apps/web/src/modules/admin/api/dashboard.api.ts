import { apiClient } from '@/lib/api-client';
import type { DashboardStatsResponse } from '@/modules/admin';

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await apiClient.get<DashboardStatsResponse>(
    '/api/v1/admin/dashboard/stats',
  );

  return response.data;
}
