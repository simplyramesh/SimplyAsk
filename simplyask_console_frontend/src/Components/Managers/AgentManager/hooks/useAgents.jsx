import { useQuery } from '@tanstack/react-query';

import { getAgents } from '../../../../Services/axios/agentManager';
import { AGENT_QUERY_KEYS } from '../constants/core';

const useAgents = (params, rest = {}) => {
  const { data: agents, isLoading: isAgentsLoading } = useQuery({
    queryKey: [AGENT_QUERY_KEYS.GET_AGENTS, params],
    queryFn: () => getAgents(params),
    ...rest,
  });

  return {
    agents,
    isAgentsLoading,
  };
};

export default useAgents;
