import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteOrchestrationGroup } from '../../Services/axios/orchestrator';

import { ORCHESTRATOR_QUERY_KEY } from './useOrchestratorDetails';

const useOrchestratorDelete = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: removeOrchestrationGroups,
    isLoading: isDeleteOrchestrationLoading,
    ...rest
  } = useMutation({
    mutationFn: (params) => deleteOrchestrationGroup(params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORCHESTRATOR_QUERY_KEY] });

      onSuccess?.({ data, variables });
    },
    onError: (error, variables) => {
      onError?.({ error, variables });
    },
  });

  return {
    removeOrchestrationGroups,
    isDeleteOrchestrationLoading,
    ...rest,
  };
};

export default useOrchestratorDelete;
