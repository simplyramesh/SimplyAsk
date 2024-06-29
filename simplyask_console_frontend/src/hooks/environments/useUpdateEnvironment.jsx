import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GET_FILTERED_ENVIRONMENTS } from '../../Components/ProcessTrigger/hooks/useGetFilteredEnvironments';
import { updateEnvironment } from '../../Services/axios/environment';

import { GET_TEST_ENVIRONMENTS_QUERY_KEY } from './useGetEnvironments';

export const useUpdateEnvironment = () => {
  const queryClient = useQueryClient();

  const { mutate: updateEnvironmentFn, isPending } = useMutation({
    mutationFn: ({ envId, updatedValues }) => updateEnvironment(envId, updatedValues),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_TEST_ENVIRONMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GET_FILTERED_ENVIRONMENTS] });

      toast.success('Environment Updated Successfully');
    },
    onError: () => {
      toast.error('Failed to update the Environment');
    },
  });

  return {
    updateEnvironmentFn,
    isLoading: isPending,
  };
};
