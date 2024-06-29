import { useQuery } from '@tanstack/react-query';
import { getAllOrganizationGroups } from '../../Services/axios/agentGroupAxios';

export const ORGANIZATION_USER_GROUPS_QUERY_KEY = 'ORGANIZATION_USER_GROUPS';

const useOrganizationUserGroups = (options) => {
  const { data, isFetching } = useQuery({
    queryKey: [ORGANIZATION_USER_GROUPS_QUERY_KEY],
    queryFn: () => getAllOrganizationGroups(),
    ...options,
  });

  return {
    data,
    isFetching,
  };
};

export default useOrganizationUserGroups;
