import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateOrchestrationGroup } from '../../Services/axios/orchestrator';

import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';

const useUpdateOrchestrator = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateOrchestration, isLoading: isOrchestratorUpdating } = useMutation({
    mutationFn: ({ processId, body }) => updateOrchestrationGroup(processId, body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });

      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    updateOrchestration,
    isOrchestratorUpdating,
  };
};

export default useUpdateOrchestrator;
