import { useMutation } from '@tanstack/react-query';

import { saveFileToIssues } from '../../../Services/axios/filesAxios';

export const useFileUploadForProcesses = ({ onSuccess, onError } = {}) => {
  const { mutate: uploadFile, isPending: isUploadFileLoading } = useMutation({
    mutationFn: ({ payload }) => saveFileToIssues(payload),
    onSuccess,
    onError,
  });

  return { uploadFile, isUploadFileLoading };
};
