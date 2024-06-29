import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';
import { cancelExecution } from '../../Services/axios/orchestrator';

export const useExecutionCancel = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: cancelCurrentExecution, isLoading: isCancelingInProgress } = useMutation({
    mutationFn: ({ id, executingId }) => cancelExecution(id, executingId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });

      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    cancelCurrentExecution,
    isCancelingInProgress,
  };
};
