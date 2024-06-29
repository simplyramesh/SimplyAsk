import { useQuery } from '@tanstack/react-query';

import { getProcessDefinitions } from '../../Services/axios/bpmnAxios';

export const GET_PROCESS_DEFINITIONS = 'getProcessDefinitions';

export const useGetProcessDefinitions = (rest = {}) => {
  const { data: processDefinitionData, isLoading: isProcessDefinitionDataLoading } = useQuery({
    queryKey: [GET_PROCESS_DEFINITIONS],
    queryFn: getProcessDefinitions,
    ...rest,
  });

  return {
    processDefinitionData,
    isProcessDefinitionDataLoading,
  };
};
