import { useQuery } from '@tanstack/react-query';
import { getTestCaseExecutions } from '../../../../Services/axios/test';

export const GET_TEST_CASE_EXECUTIONS_QUERY_KEY = 'getTestCaseExecutions';

export const useGetTestCaseExecutions = ({ payload, enabled = true }) => {
  const { testCaseId } = payload;
  const {
    data: testCaseExecutions,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_TEST_CASE_EXECUTIONS_QUERY_KEY, testCaseId],
    queryFn: () => getTestCaseExecutions(testCaseId),
    enabled,
  });

  return {
    testCaseExecutions,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
