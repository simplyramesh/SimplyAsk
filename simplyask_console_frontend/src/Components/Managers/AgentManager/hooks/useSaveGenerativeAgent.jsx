import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveGenerativeAgent } from '../../../../Services/axios/agentManager';
import { AGENT_QUERY_KEYS } from '../constants/core';

const useSaveGenerativeAgent = ({ onError, onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createGenerativeAgent, isPending: isAgentSaving } = useMutation({
    mutationFn: (body) => saveGenerativeAgent(body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [AGENT_QUERY_KEYS.GET_AGENTS] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    createGenerativeAgent,
    isAgentSaving,
  };
};

export default useSaveGenerativeAgent;
