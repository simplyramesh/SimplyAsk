import { useQuery } from '@tanstack/react-query';

import { getTransferredConversationChartDataWithMovingAverage } from '../../../Services/axios/history';

export const TRANSFERRED_CONVERSATIONS_GRAPH_QUERY_KEY = 'TRANSFERRED_CONVERSATIONS_GRAPH_QUERY_KEY';

const useGetTransferredConversationsGraph = ({ filterParams = {}, options = {} }) => {
  const { data: transferredConversations, isFetching: isTransferredConversationsFetching } = useQuery({
    queryKey: [TRANSFERRED_CONVERSATIONS_GRAPH_QUERY_KEY, filterParams],
    queryFn: () => getTransferredConversationChartDataWithMovingAverage(filterParams),
    ...options,
  });

  return {
    transferredConversations,
    isTransferredConversationsFetching,
  };
};

export default useGetTransferredConversationsGraph;
