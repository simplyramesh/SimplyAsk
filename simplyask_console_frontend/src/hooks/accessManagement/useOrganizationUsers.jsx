import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../Services/axios/userAxios';

export const ORGANIZATION_USERS_QUERY_KEY = 'ORGANIZATION_USERS';

const useOrganizationUsers = (options) => {
  const { data, isFetching } = useQuery({
    queryKey: [ORGANIZATION_USERS_QUERY_KEY],
    queryFn: () => getUsers(),
    ...options,
  });

  return {
    data,
    isFetching,
  };
};

export default useOrganizationUsers;
