import { useQuery } from '@tanstack/react-query';

import { getConversationalNumberChartDataWithMovingAverage } from '../../../Services/axios/history';

export const AVERAGE_CONVERSATIONS_GRAPH_QUERY_KEY = 'AVERAGE_CONVERSATIONS_GRAPH_QUERY_KEY';

const useGetAvgConversationsGraph = ({ filterParams = {}, options = {} }) => {
  const { data: avgConversations, isFetching: isAvgConversationsFetching } = useQuery({
    queryKey: [AVERAGE_CONVERSATIONS_GRAPH_QUERY_KEY, filterParams],
    queryFn: () => getConversationalNumberChartDataWithMovingAverage(filterParams),
    ...options,
  });

  return {
    avgConversations,
    isAvgConversationsFetching,
  };
};

export default useGetAvgConversationsGraph;
