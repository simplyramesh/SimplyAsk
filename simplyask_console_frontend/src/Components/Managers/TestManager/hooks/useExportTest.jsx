import { useMutation } from '@tanstack/react-query';
import { exportTestApi } from '../../../../Services/axios/test';

const useExportTest = ({ onSuccess, onError }) => {
  const { mutate: exportTest, isPending: isExportTestLoading } = useMutation({
    mutationFn: ({ id }) => exportTestApi(id),
    onSuccess,
    onError,
  });
  return {
    exportTest,
    isExportTestLoading,
  };
};

export default useExportTest;
