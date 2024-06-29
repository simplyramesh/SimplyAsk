import { useEffect } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';

import { cancelScheduledProcess } from '../../../Services/axios/processHistory';

import { PROCESS_EXECUTIONS_QUERY_KEY } from './useGetProcessExecutions';

export const CANCEL_PROCESS_EXECUTION_QUERY_KEY = 'cancelProcessExecution';

const useCancelProcessExecutions = ({
  executionFileIds,
  invalidateQuery = PROCESS_EXECUTIONS_QUERY_KEY,
  options = {},
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const fileIds = executionFileIds != null ? executionFileIds : [];

  const queries = fileIds?.map((id) => ({
    queryKey: [CANCEL_PROCESS_EXECUTION_QUERY_KEY, id],
    queryFn: () => cancelScheduledProcess(id),
    ...options,
  }));

  const canceledExecutions = useQueries({ queries });

  const cancelledExecutionsData = canceledExecutions.map((canceledExecution) => canceledExecution.data);
  const isFetching = canceledExecutions.some((canceledExecution) => canceledExecution.isFetching);
  const isFetched = canceledExecutions.every((canceledExecution) => canceledExecution.isFetched);

  useEffect(() => {
    if (!isFetching && isFetched) {
      queryClient.invalidateQueries({ queryKey: [invalidateQuery] });

      onSuccess?.(cancelledExecutionsData);
    }
  }, [isFetching, isFetched]);

  return {
    canceledExecutions: cancelledExecutionsData,
    isCancelledProcessesFetching: isFetching,
  };
};

export default useCancelProcessExecutions;
