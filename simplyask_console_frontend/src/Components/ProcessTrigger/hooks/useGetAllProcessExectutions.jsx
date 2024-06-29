import { useQuery } from '@tanstack/react-query';

import { getProcessExecutions } from '../../../Services/axios/processHistory';

export const GET_PROCESS_EXECUTIONS = 'getProcessExecutions';

export const useGetAllProcessExecutions = (rest = {}) => {
  const { data: processExecutionsData, isLoading: isProcessExecutionsDataLoading } = useQuery({
    queryKey: [GET_PROCESS_EXECUTIONS],
    queryFn: () => getProcessExecutions('pageSize=999'),
    ...rest,
  });

  return {
    processExecutionsData,
    isProcessExecutionsDataLoading,
  };
};
