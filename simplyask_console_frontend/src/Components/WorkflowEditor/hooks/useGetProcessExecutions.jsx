import { useQuery } from '@tanstack/react-query';

import { getProcessExecutions } from '../../../Services/axios/processHistory';

export const PROCESS_EXECUTIONS_QUERY_KEY = 'getProcessExecutions';

const useGetProcessExecutions = ({ filterParams = {}, options = {} }) => {
  // Necessary because getProcessExecutions expects a query string
  const requestParams = new URLSearchParams(filterParams);

  const { data: executions, ...rest } = useQuery({
    queryKey: [PROCESS_EXECUTIONS_QUERY_KEY, requestParams],
    queryFn: () => getProcessExecutions(requestParams),
    ...options,
  });

  return {
    executions,
    ...rest,
  };
};

export default useGetProcessExecutions;
