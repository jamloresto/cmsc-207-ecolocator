import { apiClient } from "@/lib/api-client";
import { FindCenterLocationDetail } from "@/modules/find-centers";


export async function getPublicLocationDetail(
  id: number,
): Promise<FindCenterLocationDetail> {
  const response = await apiClient.get(`/api/v1/locations/${id}`);
  return response.data.data;
}
