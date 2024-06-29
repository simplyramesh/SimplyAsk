import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../Services/axios/permissionsUsers';

export const GET_USER_BY_ID = 'GET_USER_BY_ID';

export const useGetUserById = (id, options) => {
  const { data: userInfo, isFetching: isUserFetching } = useQuery({
    queryKey: [GET_USER_BY_ID, id],
    queryFn: () => getUserById(id),
    gcTime: Infinity,
    staleTime: Infinity,
    ...options,
  });

  return {
    userInfo,
    isUserFetching,
  };
};
