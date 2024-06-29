import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProcesses } from '../../../Services/axios/processHistory';
import { PROCESS_EXECUTION_QUERY_KEYS } from '../../Issues/constants/core';
import { EXECUTION_ACTION } from '../utils/constants';

export const useUpdateProcesses = ({
  onSuccess,
  onError,
  invalidateQueries = [PROCESS_EXECUTION_QUERY_KEYS.GET_PROCESS_EXECUTIONS_FILES_QUERY_KEY],
} = {}) => {
  const queryClient = useQueryClient();

  const { mutate: removeProcesses } = useMutation({
    mutationFn: (ids) => updateProcesses(ids, EXECUTION_ACTION.DELETE),
    onSuccess: (data, variables) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];
      queriesToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      onSuccess?.({ data, variables });
    },
    onError: (error, variables) => {
      onError?.({ error, variables });
    },
  });

  return { removeProcesses };
};
