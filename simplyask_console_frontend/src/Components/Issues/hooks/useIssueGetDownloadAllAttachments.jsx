import { useMutation } from '@tanstack/react-query';

import { downloadIssueAllAttachments } from '../../../Services/axios/filesAxios';

const useIssueGetDownloadAllAttachments = ({ onSuccess, onError }) => {
  const { mutate: downloadAllAttachments, isPending: isDownloadAllAttachmentsLoading } = useMutation({
    mutationFn: (params) => downloadIssueAllAttachments(params),
    onSuccess,
    onError,
  });
  return {
    downloadAllAttachments,
    isDownloadAllAttachmentsLoading,
  };
};

export default useIssueGetDownloadAllAttachments;
