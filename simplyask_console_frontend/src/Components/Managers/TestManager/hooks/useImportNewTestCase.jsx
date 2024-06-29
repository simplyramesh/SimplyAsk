import { useMutation } from '@tanstack/react-query';
import { importNewTestCaseApi } from '../../../../Services/axios/test';

const useImportNewTestCase = ({ onSuccess, onError }) => {
  const { mutate: importNewTestCase, isPending: isImportNewTestCaseLoading } = useMutation({
    mutationFn: ({ params, payload }) => importNewTestCaseApi(params, payload),
    onSuccess,
    onError,
  });
  return {
    importNewTestCase,
    isImportNewTestCaseLoading,
  };
};

export default useImportNewTestCase;
