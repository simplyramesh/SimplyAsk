import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteParametersSet } from '../../Services/axios/environment';
import { GET_PARAMETERS_SETS_TABLE_QUERY_KEY } from './useGetParametersSet';

export const useDeleteParameterSet = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteParameterSet, isLoading } = useMutation({
    mutationFn: (requestValues) => deleteParametersSet(requestValues),
    onSuccess: () => {
      toast.success('Parameter Set Deleted');
      queryClient.invalidateQueries({ queryKey: [GET_PARAMETERS_SETS_TABLE_QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete parameter set');
    },
  });

  return {
    deleteParameterSet,
    isLoading,
  };
};
