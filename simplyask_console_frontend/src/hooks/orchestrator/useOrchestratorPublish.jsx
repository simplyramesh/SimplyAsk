import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';
import { updateOrchestrator } from '../../Services/axios/orchestrator';

export const useOrchestratorPublish = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: publishOrchestrator, isLoading: isOrchestratorPublishing } = useMutation({
    mutationFn: ({ id, payload }) => updateOrchestrator(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    publishOrchestrator,
    isOrchestratorPublishing,
  };
};
