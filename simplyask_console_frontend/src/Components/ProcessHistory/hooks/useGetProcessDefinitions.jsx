import { useQuery } from '@tanstack/react-query';
import { getProcessDefinitions } from '../../../Services/axios/bpmnAxios';

export const GET_PROCESS_DEFINITIONS_QUERY_KEY = 'GET_PROCESS_DEFINITIONS_QUERY_KEY';

const useGetProcessDefinitions = () => {
  const {
    data: allProcessDefs,
    isFetching: isProcessDefsFetching,
    ...rest
  } = useQuery({
    queryKey: GET_PROCESS_DEFINITIONS_QUERY_KEY,
    queryFn: () => getProcessDefinitions(),
  });

  return {
    allProcessDefs,
    isProcessDefsFetching,
    ...rest,
  };
};

export default useGetProcessDefinitions;
