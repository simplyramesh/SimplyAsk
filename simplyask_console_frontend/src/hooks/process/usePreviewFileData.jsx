import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitFileToPreviewFileData } from '../../Services/axios/bpmnAxios';

const usePreviewFileData = ({ invalidateQueries = [], onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: uploadFileForPreview, isPending: isUploadedFileForPreviewLoading } = useMutation({
    mutationFn: (filePayload) => submitFileToPreviewFileData(filePayload),
    onSuccess: (data) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    uploadFileForPreview,
    isUploadedFileForPreviewLoading,
  };
};

export default usePreviewFileData;
