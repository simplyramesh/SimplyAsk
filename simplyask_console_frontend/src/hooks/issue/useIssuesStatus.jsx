import { useQuery } from '@tanstack/react-query';
import { getIssuesStats } from '../../Services/axios/issuesAxios';

const ISSUES_STATS = 'getIssuesStats';

export const useIssuesStatus = () => {
  const { data: issuesStats, isFetching } = useQuery({
    queryKey: [ISSUES_STATS],
    queryFn: getIssuesStats,
  });

  return {
    issuesStats,
    isFetching,
  };
};
