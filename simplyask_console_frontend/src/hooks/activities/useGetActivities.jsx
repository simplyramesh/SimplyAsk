import { useQuery } from '@tanstack/react-query';

import { getActivities } from '../../Services/axios/activitiesAxios';

export const GET_ACTIVITIES_QUERY_KEY = 'getAllActivities';

export const useGetActivities = ({ payload, enabled = true }) => {
  const {
    data: activities,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_ACTIVITIES_QUERY_KEY, payload],
    queryFn: () => getActivities(payload),
    enabled,
  });

  return {
    activities,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
