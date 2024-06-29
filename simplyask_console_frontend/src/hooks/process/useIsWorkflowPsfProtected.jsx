import { useQuery } from '@tanstack/react-query';

import { getIsWorkflowPsfProtected } from '../../Services/axios/processManager';

export const IS_WORKFLOW_PSF_PROTECTED_QUERY_KEY = 'IS_WORKFLOW_PSF_PROTECTED_QUERY_KEY';

const useIsWorkflowPsfProtected = ({ processId, enabled, onSuccess }) => {
  const {
    data: isWorkflowPsfProtected,
    isFetching: isWorkflowPsfProtectedFetching,
    isFetched: isWorkflowPsfProtectedFetched,
  } = useQuery({
    queryKey: [IS_WORKFLOW_PSF_PROTECTED_QUERY_KEY, processId],
    queryFn: () => getIsWorkflowPsfProtected(processId),
    enabled,
    onSuccess,
  });

  return {
    isWorkflowPsfProtected,
    isWorkflowPsfProtectedFetching,
    isWorkflowPsfProtectedFetched,
  };
};

export default useIsWorkflowPsfProtected;
