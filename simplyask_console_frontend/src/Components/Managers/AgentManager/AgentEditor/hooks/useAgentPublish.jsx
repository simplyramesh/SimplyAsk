import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAgent } from '../../../../../Services/axios/agentManager';
import { AGENT_QUERY_KEYS } from '../../constants/core';

export const useAgentPublish = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: publishAgent, isPending: isAgentPublishing } = useMutation({
    mutationFn: ({ id, payload }) => updateAgent(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [AGENT_QUERY_KEYS.GET_AGENT_DETAILS] });
      queryClient.invalidateQueries({ queryKey: [AGENT_QUERY_KEYS.GET_AGENT_INTENTS] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    publishAgent,
    isAgentPublishing,
  };
};
