import { useQuery } from '@tanstack/react-query';

import { getAllProcessTriggers } from '../../../Services/axios/processHistory';

export const GET_ALL_PROCESS_TRIGGERS = 'GET_ALL_PROCESS_TRIGGERS';

export const useGetAllProcessTriggers = (rest = {}) => {
  const { data: processTriggers, isFetching: isProcessTriggersFetching } = useQuery({
    queryKey: [GET_ALL_PROCESS_TRIGGERS],
    queryFn: () => getAllProcessTriggers('pageSize=999'),
    ...rest,
  });

  return {
    processTriggers,
    isProcessTriggersFetching,
  };
};
