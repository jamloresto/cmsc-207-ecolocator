export type DashboardStats = {
  recycling_centers_count: number;
  material_types_count: number;
  pending_location_suggestions_count: number;
  unread_contact_messages_count: number;
  contact_messages_this_month_count: number;
};

export type DashboardStatsResponse = {
  data: DashboardStats;
};

export type DashboardStatsState = {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
};