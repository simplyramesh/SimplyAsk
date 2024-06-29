import { useMutation } from '@tanstack/react-query';

import { updateExistingProcessApi } from '../../../../Services/axios/processManager';

const useUpdateProcess = ({ onError, onSuccess } = {}) => {
  const { mutate: updateProcess, isFetching: isUpdateProcessLoading } = useMutation({
    mutationFn: ({ id, payload }) => updateExistingProcessApi(payload, id),
    onSuccess,
    onError,
  });

  return {
    updateProcess,
    isUpdateProcessLoading,
  };
};

export default useUpdateProcess;
