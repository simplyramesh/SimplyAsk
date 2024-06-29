import { useQuery } from '@tanstack/react-query';

import { getWorkflows } from '../../Services/axios/processManager';

export const GET_WORKFLOWS = 'getWorkflows';

export const useProcesses = ({ params = {}, options = {} }) => {
  const {
    data: processes,
    isFetching,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: [GET_WORKFLOWS, params],
    queryFn: () => getWorkflows(params),
    ...options,
  });

  return {
    processes,
    isFetching,
    refetch,
    error,
    isLoading,
  };
};
