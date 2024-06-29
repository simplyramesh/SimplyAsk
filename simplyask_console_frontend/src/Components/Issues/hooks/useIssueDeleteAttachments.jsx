import { useMutation } from '@tanstack/react-query';

import { deleteUploadedFile } from '../../../Services/axios/filesAxios';

const useIssueDeleteAttachments = ({ onSuccess, onError }) => {
  const { mutate: deleteAttachment, isPending: isDeleteAttachmentLoading } = useMutation({
    mutationFn: (payload) => deleteUploadedFile(payload),
    onSuccess,
    onError,
  });
  return {
    deleteAttachment,
    isDeleteAttachmentLoading,
  };
};

export default useIssueDeleteAttachments;
