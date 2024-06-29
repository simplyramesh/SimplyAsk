import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOrchestrationGroup } from '../../Services/axios/orchestrator';

import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';

const useOrchestrationCreate = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createOrchestration, isLoading: isOrchestratorCreating } = useMutation({
    mutationFn: (payload) => createOrchestrationGroup(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });

      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    createOrchestration,
    isOrchestratorCreating,
  };
};

export default useOrchestrationCreate;
