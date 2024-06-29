import { useQuery } from '@tanstack/react-query';

import { getIssuesCategoriesConfig } from '../../Services/axios/issuesAxios';
import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';

export const useGetIssuesCategoriesConfig = ({ enabled }) => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch: fetchData,
  } = useQuery({
    queryKey: [ISSUES_QUERY_KEYS.GET_CATEGORY_CONFIG],
    queryFn: getIssuesCategoriesConfig,
    enabled,
  });

  return {
    data,
    error,
    isLoading,
    isFetching,
    fetchData,
  };
};
