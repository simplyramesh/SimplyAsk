import { useQuery } from '@tanstack/react-query';

import { getOrchestratorGroups } from '../../../Services/axios/orchestrator';

export const GET_ALL_JOB_ORCHESTRATIONS = 'GET_ALL_JOB_ORCHESTRATIONS';

export const useGetAllOrchestratorGroups = (filterParams = '', rest = {}) => {
  const { data: orchestratorData, isLoading: isOrchestratorDataLoading } = useQuery({
    queryKey: [GET_ALL_JOB_ORCHESTRATIONS, filterParams],
    queryFn: () => getOrchestratorGroups(filterParams),
    ...rest,
  });

  return {
    orchestratorData,
    isOrchestratorDataLoading,
  };
};
