import { useQuery } from '@tanstack/react-query';

import { getIsWorkflowPsfPasswordValid } from '../../Services/axios/processManager';

export const IS_WORKFLOW_PSF_PASSWORD_VALID_QUERY_KEY = 'IS_WORKFLOW_PSF_PASSWORD_VALID_QUERY_KEY';

const useIsWorkflowPsfPasswordValid = ({ processId, password, enabled, onSuccess }) => {
  const {
    data: isWorkflowPsfPasswordValid,
    isFetching: isWorkflowPsfPasswordValidFetching,
    isFetched: isWorkflowPsfPasswordValidFetched,
  } = useQuery({
    queryKey: [IS_WORKFLOW_PSF_PASSWORD_VALID_QUERY_KEY, processId, password],
    queryFn: () =>
      getIsWorkflowPsfPasswordValid({
        processId,
        password,
      }),
    enabled,
    onSuccess,
  });

  return {
    isWorkflowPsfPasswordValid,
    isWorkflowPsfPasswordValidFetching,
    isWorkflowPsfPasswordValidFetched,
  };
};

export default useIsWorkflowPsfPasswordValid;
