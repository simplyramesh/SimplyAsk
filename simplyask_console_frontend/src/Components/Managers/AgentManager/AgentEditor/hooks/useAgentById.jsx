import { useQuery } from '@tanstack/react-query';
import { getAgentById } from '../../../../../Services/axios/agentManager';

export const GET_AGENT_BY_ID = 'GET_AGENT_BY_ID';

export const useAgentById = (id) => {
  const { data: agent, isLoading: isAgentLoading } = useQuery({
    queryKey: [GET_AGENT_BY_ID, id],
    queryFn: () => getAgentById(id),
    enabled: !!id,
  });

  return {
    agent,
    isAgentLoading,
  };
};
