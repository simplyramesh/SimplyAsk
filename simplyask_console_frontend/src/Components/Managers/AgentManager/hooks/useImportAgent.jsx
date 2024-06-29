import { useMutation } from '@tanstack/react-query';

import { importAgentApi } from '../../../../Services/axios/agentManager';

const useImportAgent = ({ onSuccess, onError }) => {
  const { mutate: importAgent, isPending: isImportAgentLoading } = useMutation({
    mutationFn: ({ payload, params = '' }) => importAgentApi(payload, params),
    onSuccess,
    onError,
  });
  return {
    importAgent,
    isImportAgentLoading,
  };
};

export default useImportAgent;
