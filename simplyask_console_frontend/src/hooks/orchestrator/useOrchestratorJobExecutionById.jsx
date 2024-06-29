import { useQuery } from '@tanstack/react-query';
import { getOrchestratorProcessDetails } from '../../Services/axios/orchestrator';

export const ORCHESTRATOR_PROCESS_EXECUTION_DETAILS = 'ORCHESTRATOR_PROCESS_EXECUTION_DETAILS';

export const useOrchestratorJobExecutionById = ({ id, jobExecutionId, onSuccess, onError, ...rest }) => {
  const { data: processDetails, isFetching: isProcessFetching } = useQuery({
    queryKey: [ORCHESTRATOR_PROCESS_EXECUTION_DETAILS, id, jobExecutionId],
    queryFn: () => getOrchestratorProcessDetails(id, jobExecutionId),
    onSuccess,
    onError,
    enabled: Boolean(id && jobExecutionId),
    ...rest,
  });

  return {
    processDetails,
    isProcessFetching,
  };
};
