import { useMutation } from '@tanstack/react-query';

import { duplicateProcessApi } from '../../../../Services/axios/processManager';

const useDuplicateProcess = ({ onError, onSuccess } = {}) => {
  const { mutate: duplicateProcess, isPending: isDuplicateProcessLoading } = useMutation({
    mutationFn: ({ id, payload }) => duplicateProcessApi(id, payload),
    onSuccess,
    onError,
  });

  return {
    duplicateProcess,
    isDuplicateProcessLoading,
  };
};

export default useDuplicateProcess;
