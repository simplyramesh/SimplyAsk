import { useQuery } from '@tanstack/react-query';
import { getTestSuiteExecutionFilter } from '../../../../Services/axios/test';

export const GET_TEST_SUITE_EXECUTIONS_QUERY_KEY = 'getTestSuiteExecutions';

export const useGetTestSuiteExecutions = ({ payload, enabled = true }) => {
  const {
    data: testSuiteExecutions,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_TEST_SUITE_EXECUTIONS_QUERY_KEY, payload],
    queryFn: () => getTestSuiteExecutionFilter(payload),
    enabled,
  });

  return {
    testSuiteExecutions,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
