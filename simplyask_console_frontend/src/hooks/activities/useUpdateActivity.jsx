import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateActivity } from '../../Services/axios/activitiesAxios';
import { GET_ACTIVITIES_QUERY_KEY } from './useGetActivities';

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateActivityFn,
    mutateAsync: updateActivityAsync,
    isLoading,
  } = useMutation({
    mutationFn: async ({ id, payload }) => updateActivity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ACTIVITIES_QUERY_KEY] });

      toast.success('Comment updated successfully');
    },
    onError: () => {
      toast.error('Error updating comment');
    },
  });

  return {
    updateActivity: updateActivityFn,
    updateActivityAsync,
    isLoading,
  };
};
