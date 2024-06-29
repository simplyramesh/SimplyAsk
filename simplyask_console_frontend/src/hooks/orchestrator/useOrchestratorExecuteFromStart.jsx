import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';
import { executeOrchestratorFromStart } from '../../Services/axios/orchestrator';
import { toast } from 'react-toastify';

export const useOrchestratorExecuteFromStart = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: executeOrchestrator, isLoading: isOrchestratorExecuting } = useMutation({
    mutationFn: (id) => executeOrchestratorFromStart(id),
    onSuccess: (data, variables) => {
      toast.success(`Orchestrator has been executed successfully`);
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });
      onSuccess?.({ data, variables });
    },
    onError: (error) => {
      toast.error('Failed to execute Orchestration');
      onError?.(error);
    },
  });

  return {
    executeOrchestrator,
    isOrchestratorExecuting,
  };
};
