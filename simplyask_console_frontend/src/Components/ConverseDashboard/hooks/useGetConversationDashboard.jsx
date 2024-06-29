import { useQuery } from '@tanstack/react-query';

import { getConversationsDashboard } from '../../../Services/axios/history';

export const CONVERSATION_DASHBOARD_QUERY_KEY = 'CONVERSATION_DASHBOARD_QUERY_KEY';

const useGetConversationDashboard = ({ filterParams = {}, options = {} }) => {
  const { data: conversationsDashboard, isFetching: isConversationsDashboardFetching } = useQuery({
    queryKey: [CONVERSATION_DASHBOARD_QUERY_KEY, filterParams],
    queryFn: () => getConversationsDashboard(filterParams),
    ...options,
  });

  return {
    conversationsDashboard,
    isConversationsDashboardFetching,
  };
};

export default useGetConversationDashboard;
