import { useQuery } from '@tanstack/react-query';
import { getExecutionHeaders } from '../../Services/axios/bpmnAxios';

export const useProcessFields = ({ processId, stepItemId, onSuccess, enabled }) => {
  const {
    data: allFields,
    isLoading: isAllFieldsLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['getExecutionHeaders', processId, stepItemId],
    queryFn: () => getExecutionHeaders(processId),
    select: (res) => res.data,
    enabled,
    onSuccess,
  });

  return {
    allFields,
    isSuccess,
    isAllFieldsLoading,
  };
};
