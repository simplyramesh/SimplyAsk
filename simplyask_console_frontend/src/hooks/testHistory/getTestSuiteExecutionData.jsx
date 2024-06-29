import { useQuery } from '@tanstack/react-query';

import { getTestSuiteByExecutionId } from '../../Services/axios/test';

export const GET_TEST_SUITE_EXECUTION_BY_ID = 'GET_TEST_SUITE_EXECUTION_BY_ID';

const useGetTestSuiteExecutionById = ({ testSuiteExecutionId, options = {} }) => {
  const {
    data: testSuiteExecutionData,
    isFetching: isTestSuiteExecutionDataLoading,
    refetch: refetchTestSuiteExecutionData,
  } = useQuery({
    queryKey: [GET_TEST_SUITE_EXECUTION_BY_ID, testSuiteExecutionId],
    queryFn: () => getTestSuiteByExecutionId(testSuiteExecutionId),
    enabled: !!testSuiteExecutionId,
    ...options,
  });

  return { testSuiteExecutionData, isTestSuiteExecutionDataLoading, refetchTestSuiteExecutionData };
};

export default useGetTestSuiteExecutionById;
