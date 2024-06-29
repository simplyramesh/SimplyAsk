import { useQuery } from '@tanstack/react-query';
import { FILE } from '../../Components/Files/constants';
import { getFileInfoMetadata } from '../../Services/axios/filesAxios';
export const GET_UNIQUE_FILE_LINKAGE_BY_ID = 'GET_UNIQUE_FILE_LINKAGE_BY_ID';

const useGetLinkedFileLocation = (fileInfo, isDeleteModalOpen) => {
  const {
    data: linkedFileLocation,
    isLoading: isLinkedFileLocationLoading,
  } = useQuery({
    queryKey: [GET_UNIQUE_FILE_LINKAGE_BY_ID, fileInfo?.fileStorage?.referenceFileId],
    queryFn: () => getFileInfoMetadata(fileInfo?.fileStorage?.referenceFileId),
    enabled: !!fileInfo?.fileStorage?.referenceFileId && fileInfo?.type === FILE && isDeleteModalOpen,
    onError: () => {
      toast.error('Failed to load file details for deletion.');
    },
  });

  return { linkedFileLocation, isLinkedFileLocationLoading };
};

export default useGetLinkedFileLocation;
