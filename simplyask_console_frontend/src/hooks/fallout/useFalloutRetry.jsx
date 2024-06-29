import { useMutation, useQuery } from '@tanstack/react-query';

import { restartProcess, updateProcessVariables } from '../../Services/axios/processManager';

const useFalloutRetry = (processInstanseId, { onRestartSuccess, onRestartError }) => {
  const { mutate: updateVariables } = useMutation({
    mutationFn: (payload) => updateProcessVariables(processInstanseId, payload),
  });

  const { mutate: restart, isPending: isRestartLoading } = useMutation({
    mutationFn: (payload) => restartProcess(processInstanseId, payload),
    onSuccess: onRestartSuccess,
    onError: onRestartError,
  });

  return { updateVariables, restart, isRestartLoading };
};

export default useFalloutRetry;
