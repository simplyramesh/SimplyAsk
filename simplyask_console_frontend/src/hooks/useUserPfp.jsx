import { useQuery } from '@tanstack/react-query';

import { getUserAvatar } from '../Services/axios/filesAxios';

const useUserPfp = (data) => {
  const { data: imgBlob, isFetching } = useQuery({
    queryKey: ['userPfp', data],
    queryFn: () => getUserAvatar(data),
    enabled: !!data,
  });

  return [imgBlob || null, isFetching];
};

export default useUserPfp;
