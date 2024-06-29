import { useQuery } from '@tanstack/react-query';

import { getIssueTypeById } from '../../Services/axios/issuesAxios';
import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';

export const useGetIssueTypeById = ({ id, enabled }) => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch: fetchData,
  } = useQuery({
    queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_BY_ID, id],
    queryFn: () => getIssueTypeById(id),
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
