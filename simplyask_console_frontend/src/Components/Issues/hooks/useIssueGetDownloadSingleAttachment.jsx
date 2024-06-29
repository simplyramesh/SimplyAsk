import { useMutation } from '@tanstack/react-query';

import { downloadApiFile } from '../../../Services/axios/filesAxios';

const useIssueGetDownloadSingleAttachment = ({ onSuccess, onError }) => {
  const { mutate: downloadSingleAttachment, isPending: isDownloadSingleAttachmentLoading } = useMutation({
    mutationFn: (payload) => downloadApiFile(payload.fileId, payload.name),
    onSuccess,
    onError,
  });
  return {
    downloadSingleAttachment,
    isDownloadSingleAttachmentLoading,
  };
};

export default useIssueGetDownloadSingleAttachment;
