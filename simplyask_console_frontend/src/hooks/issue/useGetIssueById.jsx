import { useQuery } from '@tanstack/react-query';

import { getIssueById } from '../../Services/axios/issuesAxios';

export const useGetIssueById = ({ key, issueId }) => {
  const {
    data: issue,
    error,
    isLoading,
    isFetching,
    refetch: fetchData,
    dataUpdatedAt,
  } = useQuery({
    queryKey: [key, issueId],
    queryFn: () => getIssueById(issueId),
    enabled: !!issueId,
  });

  return {
    issue,
    error,
    isLoading,
    isFetching,
    fetchData,
    dataUpdatedAt,
  };
};
