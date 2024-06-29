import { useQuery } from '@tanstack/react-query';
import { getTestGroup } from '../../../../Services/axios/test';

export const GET_TEST_GROUP_QUERY_KEY = 'getTestGroup';

export const useGetTestGroup = ({ payload, options = {} }) => {
  const { id } = payload;
  const {
    data: testGroup,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_TEST_GROUP_QUERY_KEY, id],
    queryFn: () => getTestGroup(id),
    ...options,
  });

  return {
    testGroup,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
