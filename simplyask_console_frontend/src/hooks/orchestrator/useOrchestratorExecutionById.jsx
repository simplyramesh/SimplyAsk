import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getOrchestratorSingleExecution } from '../../Services/axios/orchestrator';

export const ORCHESTRATOR_EXECUTION_QUERY_KEY = 'ORCHESTRATOR_QUERY_KEY';

const useOrchestratorExecutionById = ({ id, executingId, onSuccess, onError, ...rest }) => {
  const {
    data: orchestratorExecution,
    isFetching: isOrchestratorExecutionFetching,
    isLoading: isOrchestratorExecutionLoading,
    refetch,
  } = useQuery({
    enabled: Boolean(id && executingId),
    queryKey: [ORCHESTRATOR_EXECUTION_QUERY_KEY, id, executingId],
    queryFn: () => getOrchestratorSingleExecution(id, executingId),
    placeholderData: keepPreviousData,
    onSuccess,
    onError,
    ...rest,
  });

  return {
    orchestratorExecution,
    isOrchestratorExecutionFetching,
    isOrchestratorExecutionLoading,
    refetch,
  };
};

export default useOrchestratorExecutionById;
