import { useQuery } from '@tanstack/react-query';
import { getBillingProvinceOptions } from '../../../../../Services/axios/billing';

export const GET_BILLING_PROVINCES = 'GET_BILLING_PROVINCES';

const useGetBillingProvinces = ({ countryCode, ...rest }) => {
  const { data: provinceDataOptions, isFetching: isFetchingProvinces } = useQuery({
    queryKey: [GET_BILLING_PROVINCES, countryCode],
    queryFn: () => getBillingProvinceOptions(countryCode),
    ...rest,
  });

  return { provinceDataOptions, isFetchingProvinces };
};

export default useGetBillingProvinces;
