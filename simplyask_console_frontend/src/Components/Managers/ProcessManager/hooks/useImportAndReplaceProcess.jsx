import { useMutation } from '@tanstack/react-query';

import { importAndReplaceProcessApi } from '../../../../Services/axios/processManager';

const useImportAndReplaceProcess = ({ onSuccess, onError }) => {
  const { mutate: importAndReplaceProcess, isPending: isImportAndReplaceProcessLoading } = useMutation({
    mutationFn: ({ id, payload }) => importAndReplaceProcessApi(id, payload),
    onSuccess,
    onError,
  });
  return {
    importAndReplaceProcess,
    isImportAndReplaceProcessLoading,
  };
};

export default useImportAndReplaceProcess;
