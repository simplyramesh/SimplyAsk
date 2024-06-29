import { useQuery } from '@tanstack/react-query';
import { getAllFileLinkages } from '../../Services/axios/filesAxios';
export const GET_ALL_LINKAGES_BY_ID = 'GET_ALL_LINKAGES_BY_ID';

const useGetAllLinkedFiles = (fileInfo, fileParent, isDeleteModalOpen) => {
  const {
    data: linkedFiles,
    isLoading: isLinkedFilesLoading,
    refetch: refetchLinkedFiles,
  } = useQuery({
    queryKey: [GET_ALL_LINKAGES_BY_ID, fileInfo?.id],
    queryFn: () => getAllFileLinkages(fileParent?.id || fileInfo?.id),
    enabled: !!fileInfo?.id && isDeleteModalOpen,
    onError: () => {
      toast.error('Failed to load file details for deletion.');
    },
  });

  return { linkedFiles, isLinkedFilesLoading, refetchLinkedFiles };
};

export default useGetAllLinkedFiles;
