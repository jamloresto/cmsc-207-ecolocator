'use client';

import { useEffect, useState } from 'react';

import { getDashboardStats, DashboardStats } from '@/modules/admin';
import type { DashboardStatsState } from '@/modules/admin';

export function useDashboardStats(): DashboardStatsState {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadStats();
  }, []);

  return { stats, isLoading, error };
}
