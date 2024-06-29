import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GET_FILTERED_ENVIRONMENTS } from '../../Components/ProcessTrigger/hooks/useGetFilteredEnvironments';
import { createEnvironment } from '../../Services/axios/environment';

import { GET_TEST_ENVIRONMENTS_QUERY_KEY } from './useGetEnvironments';

export const useCreateEnvironment = () => {
  const queryClient = useQueryClient();

  const { mutate: createEnvironmentFn, isLoading } = useMutation({
    mutationFn: (requestValues) => createEnvironment(requestValues),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_TEST_ENVIRONMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GET_FILTERED_ENVIRONMENTS] });

      toast.success('New Environment Created');
    },
    onError: () => {
      toast.error('Failed to create a new Environment');
    },
  });

  return {
    createEnvironmentFn,
    isLoading,
  };
};
