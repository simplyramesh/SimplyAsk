import { useQuery } from '@tanstack/react-query';
import { getOrchestratorDetails } from '../../Services/axios/orchestrator';

export const ORCHESTRATOR_QUERY_KEY = 'ORCHESTRATOR_QUERY_KEY';

const useOrchestratorDetails = ({ id, onSuccess, onError, ...rest }) => {
  const { data: orchestrator, isFetching: isOrchestratorFetching } = useQuery({
    queryKey: [ORCHESTRATOR_QUERY_KEY, id],
    queryFn: () => getOrchestratorDetails(id),
    onSuccess,
    onError,
    ...rest,
  });

  return {
    orchestrator,
    isOrchestratorFetching,
  };
};

export default useOrchestratorDetails;
