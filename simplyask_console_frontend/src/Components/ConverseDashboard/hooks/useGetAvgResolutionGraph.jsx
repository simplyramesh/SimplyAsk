import { useQuery } from '@tanstack/react-query';

import { getIssuesAverageResolutionTimeWithMovingAverage } from '../../../Services/axios/history';

export const SERVICE_TICKETS_RESOLUTION_TIME_GRAPH_QUERY_KEY = 'SERVICE_TICKETS_RESOLUTION_TIME_GRAPH_QUERY_KEY';

const useGetAvgResolutionGraph = ({ filterParams = {}, options = {} }) => {
  const { data: avgResolutions, isFetching: isAvgResolutionsFetching } = useQuery({
    queryKey: [SERVICE_TICKETS_RESOLUTION_TIME_GRAPH_QUERY_KEY, filterParams],
    queryFn: () => getIssuesAverageResolutionTimeWithMovingAverage(filterParams),
    ...options,
  });

  return {
    avgResolutions,
    isAvgResolutionsFetching,
  };
};

export default useGetAvgResolutionGraph;
