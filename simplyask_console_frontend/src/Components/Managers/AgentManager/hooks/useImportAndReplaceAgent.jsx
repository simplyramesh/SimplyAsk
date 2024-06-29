import { useMutation } from '@tanstack/react-query';

import { importAndReplaceAgentApi } from '../../../../Services/axios/agentManager';

const useImportAndReplaceAgent = ({ onSuccess, onError }) => {
  const { mutate: importAndReplaceAgent, isPending: isImportAndReplaceAgentLoading } = useMutation({
    mutationFn: ({ id, payload }) => importAndReplaceAgentApi(id, payload),
    onSuccess,
    onError,
  });
  return {
    importAndReplaceAgent,
    isImportAndReplaceAgentLoading,
  };
};

export default useImportAndReplaceAgent;
