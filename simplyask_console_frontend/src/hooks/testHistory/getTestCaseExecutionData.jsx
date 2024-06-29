import { useQuery } from '@tanstack/react-query';

import { getExecutedTestCaseByExecutionId } from '../../Services/axios/test';

export const GET_TEST_CASE_EXECUTION_BY_ID = 'GET_TEST_CASE_EXECUTION_BY_ID';

const useGetTestCaseExecutionById = ({ executionId, options = {} }) => {
  const {
    data: testCaseExecutionData,
    isFetching: isTestCaseExecutionDataLoading,
    isRefetching: isTestCaseExecutionDataRefetching,
    refetch: refetchExecutedTestCase,
  } = useQuery({
    queryKey: [GET_TEST_CASE_EXECUTION_BY_ID, executionId],
    queryFn: () => getExecutedTestCaseByExecutionId(executionId),
    ...options,
  });

  return {
    testCaseExecutionData,
    isTestCaseExecutionDataLoading,
    refetchExecutedTestCase,
    isTestCaseExecutionDataRefetching,
  };
};

export default useGetTestCaseExecutionById;
