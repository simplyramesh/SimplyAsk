import { useQuery } from '@tanstack/react-query';

import { getExecutionHeaders } from '../../Services/axios/bpmnAxios';

export const GET_EXECUTION_HEADERS = 'getExecutionHeaders';

export const useGetExecutionHeaders = ({ pathVariable, options }) => {
  const {
    data: dataHeaderColumns,
    isFetching: isDataHeaderFetching,
    ...rest
  } = useQuery({
    queryKey: [GET_EXECUTION_HEADERS, pathVariable],
    queryFn: () => getExecutionHeaders(pathVariable),
    ...options,
  });

  return {
    dataHeaderColumns,
    isDataHeaderFetching,
    ...rest,
  };
};
