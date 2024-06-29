import { useQuery } from '@tanstack/react-query';
import { getProcessesTags } from '../../Services/axios/bpmnAxios';

export const GET_PROCESSES_TAGS = 'GET_PROCESSES_TAGS';

export const useProcessesTags = (rest = {}) => {
  const { data: processesTags, isLoading: isProcessesTagsLoading } = useQuery({
    queryKey: [GET_PROCESSES_TAGS],
    queryFn: getProcessesTags,
    ...rest,
  });

  return {
    processesTags,
    isProcessesTagsLoading,
  };
};
