import { useQuery } from '@tanstack/react-query';

import { getIssuesDashboard } from '../../../Services/axios/history';

export const SERVICE_TICKET_DASHBOARD_QUERY_KEY = 'SERVICE_TICKET_DASHBOARD_QUERY_KEY';

const useGetServiceDashboard = ({ filterParams = {}, options = {} }) => {
  const { data: serviceTicketDashboard, isFetching: isServiceTicketDashboardFetching } = useQuery({
    queryKey: [SERVICE_TICKET_DASHBOARD_QUERY_KEY, filterParams],
    queryFn: () => getIssuesDashboard(filterParams),
    ...options,
  });

  return {
    serviceTicketDashboard,
    isServiceTicketDashboardFetching,
  };
};

export default useGetServiceDashboard;
