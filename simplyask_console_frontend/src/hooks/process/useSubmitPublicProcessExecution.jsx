import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitPublicProcessExecution } from '../../Services/axios/bpmnAxios';

const useSubmitPublicProcessExecution = ({ invalidateQueries = [], onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: submitPublicExecution, isPending: isSubmitPublicExecutionLoading } = useMutation({
    mutationFn: ({
      apiKey, orgId, payload, files,
    }) => submitPublicProcessExecution({ authorization: apiKey, organizationId: orgId }, payload, files),
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
    submitPublicExecution,
    isSubmitPublicExecutionLoading,
  };
};

export default useSubmitPublicProcessExecution;
