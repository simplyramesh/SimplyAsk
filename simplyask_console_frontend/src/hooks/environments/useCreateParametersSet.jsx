import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createParametersSet } from '../../Services/axios/environment';
import { GET_PARAMETERS_SETS_TABLE_QUERY_KEY } from './useGetParametersSet';

export const useCreateParametersSet = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createParameterSetFn, isPending: isCreateParameterSetLoading } = useMutation({
    mutationFn: (payload) => createParametersSet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_PARAMETERS_SETS_TABLE_QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => onError?.(),
  });

  return {
    createParameterSet: createParameterSetFn,
    isCreateParameterSetLoading,
  };
};
