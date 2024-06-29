import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../Services/axios/userAxios';

export const GET_CURRENT_USER = 'GET_CURRENT_USER';

export const useGetCurrentUser = () => {
  const {
    data: currentUser,
    error: currentUserError,
    isLoading: isLoadingCurrentUser,
    isFetching: isFetchingCurrentUser,
    refetch: refetchCurrentUser,
  } = useQuery({
    queryKey: [GET_CURRENT_USER],
    queryFn: () => getCurrentUser(),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  return {
    currentUser,
    currentUserError,
    isLoadingCurrentUser,
    isFetchingCurrentUser,
    refetchCurrentUser,
  };
};
