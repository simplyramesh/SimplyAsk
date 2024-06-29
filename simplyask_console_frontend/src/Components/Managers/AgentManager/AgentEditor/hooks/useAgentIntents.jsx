import { useQuery } from '@tanstack/react-query';

import { getAgentIntentsById } from '../../../../../Services/axios/agentAxios';
import { AGENT_QUERY_KEYS } from '../../constants/core';

const useAgentIntents = (params) => {
  const { data: intents, isFetching: isIntentLoading } = useQuery({
    queryKey: [AGENT_QUERY_KEYS.GET_AGENT_INTENTS, params.agentId],
    queryFn: () => getAgentIntentsById(params),
    enabled: !!params.agentId,
    gcTime: Infinity,
    staleTime: Infinity,
  });
  return {
    intents,
    isIntentLoading,
  };
};

export default useAgentIntents;
