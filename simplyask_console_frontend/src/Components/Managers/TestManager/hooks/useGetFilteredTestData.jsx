import { useQuery } from '@tanstack/react-query';
import { getFilteredTestData } from '../../../../Services/axios/test';

export const GET_FILTERED_TEST_DATA = 'GET_FILTERED_TEST_DATA';

export const useGetFilteredTestData = ({ params = {}, ...rest }) => {
  const { data: filteredTestData, isLoading: isFilteredTestDataLoading } = useQuery({
    queryKey: [GET_FILTERED_TEST_DATA, params],
    queryFn: () => getFilteredTestData(params),
    ...rest,
  });

  return {
    filteredTestData,
    isFilteredTestDataLoading,
  };
};
