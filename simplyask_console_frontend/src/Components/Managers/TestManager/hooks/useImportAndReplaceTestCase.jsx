import { useMutation } from '@tanstack/react-query';
import { importAndReplaceTestCaseApi } from '../../../../Services/axios/test';

const useImportAndReplaceTestCase = ({ onSuccess, onError }) => {
  const { mutate: importAndReplaceTestCase, isPending: isImportAndReplaceTestCaseLoading } = useMutation({
    mutationFn: ({ displayName, params, payload }) => importAndReplaceTestCaseApi(displayName, params, payload),
    onSuccess,
    onError,
  });
  return {
    importAndReplaceTestCase,
    isImportAndReplaceTestCaseLoading,
  };
};

export default useImportAndReplaceTestCase;
