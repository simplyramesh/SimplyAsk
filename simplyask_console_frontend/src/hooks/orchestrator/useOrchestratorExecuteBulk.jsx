import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';
import { bulkExecuteOrchestrators } from '../../Services/axios/orchestrator';

export const useOrchestratorExecuteBulk = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: executeOrchestratorBulk, isLoading: isOrchestratorExecutingBulk } = useMutation({
    mutationFn: (body) => bulkExecuteOrchestrators(body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    executeOrchestratorBulk,
    isOrchestratorExecutingBulk,
  };
};
