import { useQuery } from '@tanstack/react-query';
import { getTestGroupExecutions } from '../../../../Services/axios/test';

export const GET_TEST_GROUP_EXECUTIONS_QUERY_KEY = 'getTestGroupExecutions';

export const useGetTestGroupExecutions = ({ payload, enabled = true }) => {
  const { testGroupId } = payload;
  const {
    data: testGroupExecutions,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_TEST_GROUP_EXECUTIONS_QUERY_KEY, testGroupId],
    queryFn: () => getTestGroupExecutions(testGroupId, payload),
    enabled,
  });

  return {
    testGroupExecutions,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
