import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GET_ACTIVITIES_QUERY_KEY } from './useGetActivities';
import { updateActivitiesStatus } from '../../Services/axios/activitiesAxios';

export const useUpdateActivitiesStatus = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateActivityStatus,
    mutateAsync: updateActivityStatusAsync,
    isLoading,
  } = useMutation({
    mutationFn: async ({ activityIds, isRead }) => updateActivitiesStatus(activityIds, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ACTIVITIES_QUERY_KEY] });
    },
    onError: () => {
      toast.error('Error updating activity status');
    },
  });

  return {
    updateActivityStatus,
    updateActivityStatusAsync,
    isLoading,
  };
};
