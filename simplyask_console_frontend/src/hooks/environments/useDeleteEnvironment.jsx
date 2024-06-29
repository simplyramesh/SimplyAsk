import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GET_FILTERED_ENVIRONMENTS } from '../../Components/ProcessTrigger/hooks/useGetFilteredEnvironments';
import { deleteEnvironment } from '../../Services/axios/environment';
import { GET_TEST_ENVIRONMENTS_QUERY_KEY } from './useGetEnvironments';

export const useDeleteEnvironment = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteEnvironmentFn, isLoading } = useMutation({
    mutationFn: async (id) => deleteEnvironment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_TEST_ENVIRONMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GET_FILTERED_ENVIRONMENTS] });

      toast.success('Environment was deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting environment');
    },
  });

  return {
    deleteEnvironment: deleteEnvironmentFn,
    isLoading,
  };
};
