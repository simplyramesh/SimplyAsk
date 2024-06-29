import { useQuery } from '@tanstack/react-query';
import { getTestSuite } from '../../../../Services/axios/test';

export const GET_TEST_SUITE_QUERY_KEY = 'getTestSuite';

export const useGetTestSuite = ({ payload, options = {} }) => {
  const { id } = payload;
  const {
    data: testSuite,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_TEST_SUITE_QUERY_KEY, id],
    queryFn: () => getTestSuite(id),
    ...options,
  });

  return {
    testSuite,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
