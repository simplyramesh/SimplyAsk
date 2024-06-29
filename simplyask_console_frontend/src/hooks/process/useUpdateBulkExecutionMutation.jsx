import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitUpdatePreparationRequest } from '../../Services/axios/bpmnAxios';

const useUpdateBulkExecutionMutation = ({ invalidateQueries = [], onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (filePayload) => submitUpdatePreparationRequest(filePayload),
    onSuccess: (data) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    mutate,
    isLoading,
  };
};

export default useUpdateBulkExecutionMutation;
