import { useQuery } from '@tanstack/react-query';

import { getProcessHistoryDataById } from '../../../Services/axios/bpmnAxios';

export const GET_PROCESS_HISTORY_BY_ID = 'GET_PROCESS_HISTORY_BY_ID';

const useGetProcessHistoryById = ({ id, requestParams, queryParams = {} }) => {
  const {
    data: singleProcessHistory,
    isFetching: isSingleProcessHistoryFetching,
    refetch: refetchSingleProcessHistory,
    isError,
  } = useQuery({
    queryKey: [GET_PROCESS_HISTORY_BY_ID, id],
    queryFn: () => getProcessHistoryDataById(id, requestParams),
    ...queryParams,
  });
  return {
    singleProcessHistory,
    isSingleProcessHistoryFetching,
    refetchSingleProcessHistory,
    isError,
  };
};

export default useGetProcessHistoryById;
