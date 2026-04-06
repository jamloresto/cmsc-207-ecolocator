'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { logoutAdmin, logoutSuccess } from '@/modules/auth';

export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: (data) => {
      dispatch(logoutSuccess());

      queryClient.clear();

      toast({
        title: 'Logged out',
        description: data.message || 'You have been logged out successfully.',
        variant: 'success',
      });

      router.replace('/admin/login');
    },
    onError: () => {
      toast({
        title: 'Logout failed',
        description: 'Something went wrong while logging out.',
        variant: 'danger',
      });
    },
  });
}
