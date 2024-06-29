import { useQuery } from '@tanstack/react-query';

import { getOrganizationApiKey } from '../../../../../../Services/axios/processManager';

export const GET_ORGANIZATION_API_KEY_QUERY_KEY = 'GET_ORGANIZATION_API_KEY_QUERY_KEY';

const useGetOrgAPIKey = ({ options = {} }) => {
  const {
    data: defaultOrganizationKey,
    isFetching: organizationKeyLoading,
    isSuccess: isOrganizationKeySuccess,
  } = useQuery({
    queryKey: [GET_ORGANIZATION_API_KEY_QUERY_KEY],
    queryFn: getOrganizationApiKey,
    ...options,
  });

  return {
    defaultOrganizationKey,
    organizationKeyLoading,
    isOrganizationKeySuccess,
  };
};

export default useGetOrgAPIKey;
