import { useMutation } from '@tanstack/react-query';

import { saveFileToIssues } from '../../../Services/axios/filesAxios';

const useIssueUploadAttachments = ({ onSuccess, onError }) => {
  const { mutate: uploadFileToIssue, isPending: isUploadFileToIssueLoading } = useMutation({
    mutationFn: (payload) => saveFileToIssues(payload),
    onSuccess,
    onError,
  });
  return {
    uploadFileToIssue,
    isUploadFileToIssueLoading,
  };
};

export default useIssueUploadAttachments;
