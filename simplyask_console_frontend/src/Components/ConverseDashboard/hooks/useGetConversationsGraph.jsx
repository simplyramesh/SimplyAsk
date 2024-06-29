import { useQuery } from '@tanstack/react-query';

import { getConversationalChartData } from '../../../Services/axios/history';

export const CONVERSATIONS_GRAPH_QUERY_KEY = 'CONVERSATIONS_GRAPH_QUERY_KEY';

const useGetConversationsGraph = ({ filterParams = {}, options = {} }) => {
  const { data: conversations, isFetching: isConversationsFetching } = useQuery({
    queryKey: [CONVERSATIONS_GRAPH_QUERY_KEY, filterParams],
    queryFn: () => getConversationalChartData(filterParams),
    ...options,
  });

  return {
    conversations,
    isConversationsFetching,
  };
};

export default useGetConversationsGraph;
