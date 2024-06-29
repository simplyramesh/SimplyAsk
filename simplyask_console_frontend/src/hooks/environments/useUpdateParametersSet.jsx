import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateParametersSet } from '../../Services/axios/environment';
import { GET_PARAMETERS_SETS_TABLE_QUERY_KEY } from './useGetParametersSet';

export const useUpdateParametersSet = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateParametersSetFn, isPending: isUpdateParameterSetLoading } = useMutation({
    mutationFn: ({ id, payload }) => updateParametersSet(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_PARAMETERS_SETS_TABLE_QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => onError?.(),
  });

  return {
    updateParametersSet: updateParametersSetFn,
    isUpdateParameterSetLoading,
  };
};
