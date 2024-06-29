import { useMutation } from '@tanstack/react-query';

import { exportProcessApi } from '../../../../Services/axios/processManager';

const useExportProcess = ({ onSuccess, onError }) => {
  const { mutate: exportProcess, isPending: isExportProcessLoading } = useMutation({
    mutationFn: ({ id }) => exportProcessApi(id),
    onSuccess,
    onError,
  });
  return {
    exportProcess,
    isExportProcessLoading,
  };
};

export default useExportProcess;
