import { useQuery } from '@tanstack/react-query';

import { getParametersSets } from '../../Services/axios/environment';

export const GET_PARAMETERS_SETS_TABLE_QUERY_KEY = 'getParametersSet';

export const useGetParametersSet = ({ payload = {}, options = {} } = {}) => {
  const { filter } = payload;

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: [GET_PARAMETERS_SETS_TABLE_QUERY_KEY, filter],
    queryFn: () => getParametersSets(filter),
    enabled: true,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
