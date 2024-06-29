import { useQuery } from '@tanstack/react-query';
import { getOrganizationDetails } from '../../../../../Services/axios/authAxios';

export const GET_ORGANIZATION_DETAILS = 'GET_ORGANIZATION_DETAILS';

const useGetOrgDetails = (rest = {}) => {
  const { data: organizationDetails, isFetching: isOrganizationDetailsFetching } = useQuery({
    queryKey: [GET_ORGANIZATION_DETAILS],
    queryFn: getOrganizationDetails,
    ...rest,
  });

  return { organizationDetails, isOrganizationDetailsFetching };
};

export default useGetOrgDetails;
