import { useQuery } from '@tanstack/react-query';
import { getApiFile } from '../../../Services/axios/filesAxios';

export const FILE_DATA_QUERY_KEY = 'FILE_DATA_QUERY_KEY';

const useSingleFileData = ({ fileId, params }) => {
  const { data: fileData, isPending: isFileLoading } = useQuery({
    queryKey: [FILE_DATA_QUERY_KEY, fileId],
    queryFn: () => getApiFile(fileId),
    enabled: !!fileId,
    ...params,
  });

  return {
    fileData,
    isFileLoading,
  };
};

export default useSingleFileData;
