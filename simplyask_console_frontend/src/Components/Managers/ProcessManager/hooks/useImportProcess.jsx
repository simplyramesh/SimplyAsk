import { useMutation } from '@tanstack/react-query';

import { importProcessApi } from '../../../../Services/axios/processManager';

const useImportProcess = ({ onSuccess, onError }) => {
  const { mutate: importProcess, isPending: isImportProcessLoading } = useMutation({
    mutationFn: ({ payload, params = '' }) => importProcessApi(payload, params),
    onSuccess,
    onError,
  });
  return {
    importProcess,
    isImportProcessLoading,
  };
};

export default useImportProcess;
