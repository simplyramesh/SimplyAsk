import { useMutation } from '@tanstack/react-query';

import { exportAgentApi } from '../../../../Services/axios/agentManager';

const useExportAgent = ({ onSuccess, onError }) => {
  const { mutate: exportAgent, isPending: isExportAgentLoading } = useMutation({
    mutationFn: ({ id }) => exportAgentApi(id),
    onSuccess,
    onError,
  });
  return {
    exportAgent,
    isExportAgentLoading,
  };
};

export default useExportAgent;
