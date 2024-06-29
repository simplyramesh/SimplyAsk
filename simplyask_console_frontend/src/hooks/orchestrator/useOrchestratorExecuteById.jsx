import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';
import { executeOrchestratorById } from '../../Services/axios/orchestrator';

export const useOrchestratorExecuteById = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: executeOrchestrator, isLoading: isOrchestratorExecuting } = useMutation({
    mutationFn: (id) => executeOrchestratorById(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    executeOrchestrator,
    isOrchestratorExecuting,
  };
};
