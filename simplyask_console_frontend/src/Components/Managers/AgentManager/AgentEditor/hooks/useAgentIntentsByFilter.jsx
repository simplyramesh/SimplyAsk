import { useQuery } from '@tanstack/react-query';
import { getAgentIntentsByFilter } from '../../../../../Services/axios/agentAxios';

export const GET_AGENT_INTENTS_BY_FILTER = 'GET_AGENT_INTENTS_BY_FILTER';

const useAgentIntentsByFilter = (params) => {
  const { data: intents, isFetching: isIntentLoading } = useQuery({
    queryKey: [GET_AGENT_INTENTS_BY_FILTER, params],
    queryFn: () => getAgentIntentsByFilter(params),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  return {
    intents,
    isIntentLoading,
  };
};

export default useAgentIntentsByFilter;
