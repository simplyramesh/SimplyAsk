import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AGENT_QUERY_KEYS } from '../constants/core';
import { createAgent } from '../../../../Services/axios/agentManager';

const useCreateAgent = ({ onError, onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createNewAgent, isPending: isAgentCreating } = useMutation({
    mutationFn: (body) => createAgent(body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [AGENT_QUERY_KEYS.GET_AGENTS] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    createNewAgent,
    isAgentCreating,
  };
};

export default useCreateAgent;
