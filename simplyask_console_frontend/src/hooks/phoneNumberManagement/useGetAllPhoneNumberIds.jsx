import { useQuery } from '@tanstack/react-query';
import { getTelephonyInfo } from '../../Services/axios/phoneNumberManagementAxios';
import { PHONE_NUMBER_MANAGEMENT_QUERY_KEYS } from '../../Components/Settings/Components/FrontOffice/constants/common';

const useGetAllPhoneNumberIds = (associatedPhoneNumberIds) => {
  const { data: filteredPhoneNumberIds, isFetching: isPhoneNumberIdsFetching } = useQuery({
    queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_All_PHONE_NUMBER_IDS, associatedPhoneNumberIds],
    queryFn: () => getTelephonyInfo(`telephonyId=${associatedPhoneNumberIds}&pageSize=999&isActive=true`),
    enabled: !!associatedPhoneNumberIds,
    select: (res) => res?.content,
  });

  return { filteredPhoneNumberIds, isPhoneNumberIdsFetching };
};

export default useGetAllPhoneNumberIds;
