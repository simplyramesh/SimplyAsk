import { useQuery } from '@tanstack/react-query';
import { getEnvironments } from '../../Services/axios/environment';

export const GET_TEST_ENVIRONMENTS_QUERY_KEY = 'getTestEnvironments';

export const useGetEnvironments = ({ payload = {}, enabled = true } = {}, options = {}) => {
  const { filter } = payload;

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: [GET_TEST_ENVIRONMENTS_QUERY_KEY, filter],
    queryFn: () => getEnvironments(filter),
    enabled,
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
