import { useMutation } from '@tanstack/react-query';

import { duplicateAgentApi } from '../../../../Services/axios/agentManager';

const useDuplicateAgent = ({ onError, onSuccess } = {}) => {
  const { mutate: duplicateAgent, isPending: isDuplicateAgentLoading } = useMutation({
    mutationFn: ({ id, body }) => duplicateAgentApi(id, body),
    onSuccess,
    onError,
  });

  return {
    duplicateAgent,
    isDuplicateAgentLoading,
  };
};

export default useDuplicateAgent;
