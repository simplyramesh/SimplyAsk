import { useQuery } from '@tanstack/react-query';

import { getTestCase } from '../../../../Services/axios/test';

export const GET_TEST_CASE_QUERY_KEY = 'getTestCase';

export const useGetTestCase = ({ payload, enabled = true }) => {
  const { id } = payload;
  const {
    data: testCase,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_TEST_CASE_QUERY_KEY, id],
    queryFn: () => getTestCase(id),
    enabled,
  });

  return {
    testCase,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
