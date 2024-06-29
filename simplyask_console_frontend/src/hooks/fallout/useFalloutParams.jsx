import { useQuery } from '@tanstack/react-query';

import { getProcessVariables } from '../../Services/axios/processManager';

export const useProcessParams = ({ procInstanceId }) => {
  const { data: processParams } = useQuery({
    queryKey: ['processParams', procInstanceId],
    queryFn: () => getProcessVariables(procInstanceId),
    enabled: !!procInstanceId,
  });

  return {
    processParams,
  };
};
