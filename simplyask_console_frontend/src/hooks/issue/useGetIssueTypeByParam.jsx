import { useQuery } from '@tanstack/react-query';

import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import { getIssueTypes } from '../../Services/axios/issuesAxios';

export const useGetIssueTypeByParam = ({ filterParams, options = {} }) => {
  const queryParams = new URLSearchParams(filterParams).toString();

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch: fetchData,
    ...rest
  } = useQuery({
    queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TYPE_DISPLAY_NAME, queryParams],
    queryFn: () => getIssueTypes(queryParams),
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    isFetching,
    fetchData,
    ...rest,
  };
};
