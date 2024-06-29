import { useQuery } from '@tanstack/react-query';

import { getAllAgents } from '../../../Services/axios/conversationHistoryAxios';

export const GET_ALL_AGENTS = 'GET_ALL_AGENTS';

export const useGetAllAgents = (filterParams = '', rest = {}) => {
  const { data: allAgents, isFetching: isAllAgentsLoading } = useQuery({
    queryKey: [GET_ALL_AGENTS, filterParams],
    queryFn: () => getAllAgents(filterParams),
    ...rest,
  });

  return {
    allAgents,
    isAllAgentsLoading,
  };
};
