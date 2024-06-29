import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAgentDetails } from '../../../../Services/axios/agentManager';
import { AGENT_QUERY_KEYS } from '../constants/core';

const useUpdateAgent = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: updateAgentById, isPending: isUpdateAgentByIdLoading } = useMutation({
    mutationFn: async (payload) => updateAgentDetails(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [AGENT_QUERY_KEYS.GET_AGENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [AGENT_QUERY_KEYS.GET_AGENT_DETAILS],
      });

      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return { updateAgentById, isUpdateAgentByIdLoading };
};

export default useUpdateAgent;
