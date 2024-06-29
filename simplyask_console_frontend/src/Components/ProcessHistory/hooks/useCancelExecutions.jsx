import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useCallback, useEffect, useState } from 'react';
import { cancelProcessExecutions } from '../../../Services/axios/processHistory';

const PROCESS_HISTORY_CANCEL_EXECUTIONS_QUERY_KEY = 'PROCESS_HISTORY_CANCEL_EXECUTIONS_QUERY_KEY';

export const useGetCancelExecutions = ({ processIds, options = {} }) => {
  const processIdsArr = Array.isArray(processIds) ? processIds : [processIds];

  const { data, isFetching, isError, isSuccess, isPending, ...rest } = useQuery({
    queryKey: [PROCESS_HISTORY_CANCEL_EXECUTIONS_QUERY_KEY, processIdsArr],
    queryFn: () => cancelProcessExecutions(processIdsArr),
    ...options,
  });

  return {
    cancelledExecutions: data,
    isCancelExecutionsFetching: isFetching,
    isCancelExecutionsError: isError,
    isCancelExecutionsSuccess: isSuccess,
    isCancelExecutionsPending: isPending,
    ...rest,
  };
};

export const useCancelExecutions = ({ processIds, invalidateKeys, onSuccess }) => {
  const queryClient = useQueryClient();

  const [isCancelExecutionsEnabled, setIsCancelExecutionsEnabled] = useState(false);

  const { isCancelExecutionsFetching, isCancelExecutionsError, isCancelExecutionsSuccess, ...rest } =
    useGetCancelExecutions({
      processIds,
      options: {
        enabled: isCancelExecutionsEnabled,
      },
    });

  const handleRefresh = useCallback(() => {
    if (!invalidateKeys) return;

    [].concat(invalidateKeys).forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [invalidateKeys, queryClient]);

  const handleCancelExecutions = useCallback(() => {
    setIsCancelExecutionsEnabled(true);
  }, []);

  useEffect(() => {
    if (isCancelExecutionsError) {
      setIsCancelExecutionsEnabled(false);
    }
  }, [isCancelExecutionsError]);

  useEffect(() => {
    if (isCancelExecutionsSuccess) {
      const processIdsArr = Array.isArray(processIds) ? processIds : [processIds];
      queryClient.removeQueries({ queryKey: [PROCESS_HISTORY_CANCEL_EXECUTIONS_QUERY_KEY, processIdsArr] });

      onSuccess?.();
      setIsCancelExecutionsEnabled(false);
    }
  }, [isCancelExecutionsSuccess]);


  return {
    isCancelExecutionsFetching,
    handleRefresh,
    handleCancelExecutions,
    ...rest,
  };
};
