import { useQuery } from '@tanstack/react-query';

import { getAgentDetails } from '../../../../Services/axios/agentManager';

export const GET_AGENT_GRAPH_DETAILS_BY_ID = 'GET_AGENT_GRAPH_DETAILS_BY_ID';

const useAgentGraphDetailsById = (id, rest = {}) => {
  const { data: agentGraphDetails, isFetching: isAgentGraphDetailsFetching } = useQuery({
    queryKey: [GET_AGENT_GRAPH_DETAILS_BY_ID, id],
    queryFn: () => getAgentDetails(id),
    enabled: !!id,
    ...rest,
  });

  return {
    agentGraphDetails,
    isAgentGraphDetailsFetching,
  };
};

export default useAgentGraphDetailsById;
