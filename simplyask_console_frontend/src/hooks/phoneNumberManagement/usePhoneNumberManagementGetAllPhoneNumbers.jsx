import { useQuery } from '@tanstack/react-query';
import { getTelephonyInfo } from '../../Services/axios/phoneNumberManagementAxios';
import { PHONE_NUMBER_MANAGEMENT_QUERY_KEYS } from '../../Components/Settings/Components/FrontOffice/constants/common';

const useGetAllPhoneNumbers = () => {
  const { data: getAllPhoneNumbers } = useQuery({
    queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_INFO],
    queryFn: () => getTelephonyInfo('pageSize=999&isActive=true'),
  });

  return { getAllPhoneNumbers };
};

export default useGetAllPhoneNumbers;
