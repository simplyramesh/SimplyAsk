import { useQuery } from '@tanstack/react-query';

import { getExecutedTestGroupById } from '../../Services/axios/test';

export const GET_TEST_GROUP_EXECUTION_BY_ID = 'GET_TEST_GROUP_EXECUTION_BY_ID';

const useGetTestGroupExecutionById = ({ testId, options = {} }) => {
  const {
    data: testGroupExecutionData,
    isFetching: isExecutedTestGroupLoading,
    refetch: refetchTestGroupExecutionData,
  } = useQuery({
    queryKey: [GET_TEST_GROUP_EXECUTION_BY_ID, testId],
    queryFn: () => getExecutedTestGroupById(testId),
    enabled: !!testId,
    ...options,
  });

  return { testGroupExecutionData, isExecutedTestGroupLoading, refetchTestGroupExecutionData };
};

export default useGetTestGroupExecutionById;
