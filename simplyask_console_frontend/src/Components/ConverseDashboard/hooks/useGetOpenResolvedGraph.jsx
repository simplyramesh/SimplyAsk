import { useQuery } from '@tanstack/react-query';

import { getIssuesChartData } from '../../../Services/axios/history';

export const SERVICE_TICKETS_OPEN_RESOLVED_GRAPH_QUERY_KEY = 'SERVICE_TICKETS_OPEN_RESOLVED_GRAPH_QUERY_KEY';

const useGetOpenResolvedGraph = ({ filterParams = {}, options = {} }) => {
  const { data: openResolved, isFetching: isOpenResolvedFetching } = useQuery({
    queryKey: [SERVICE_TICKETS_OPEN_RESOLVED_GRAPH_QUERY_KEY, filterParams],
    queryFn: () => getIssuesChartData(filterParams),
    ...options,
  });

  return {
    openResolved,
    isOpenResolvedFetching,
  };
};

export default useGetOpenResolvedGraph;
