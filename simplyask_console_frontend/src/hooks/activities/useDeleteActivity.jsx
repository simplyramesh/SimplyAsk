import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteActivity } from '../../Services/axios/activitiesAxios';
import { GET_ACTIVITIES_QUERY_KEY } from './useGetActivities';

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteActivityFn,
    mutateAsync: deleteActivityAsync,
    isLoading,
  } = useMutation({
    mutationFn: async (id) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ACTIVITIES_QUERY_KEY] });

      toast.success('Comment deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting comment');
    },
  });

  return {
    deleteActivity: deleteActivityFn,
    deleteActivityAsync,
    isLoading,
  };
};
