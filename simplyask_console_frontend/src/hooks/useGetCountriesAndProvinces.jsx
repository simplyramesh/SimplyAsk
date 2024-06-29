import { useQuery } from '@tanstack/react-query';

import { getBillingProvinceOptions } from '../Services/axios/billing';

export const ALL_PROVINCES_QUERY_KEY = 'PROVINCES_QUERY_KEY';

export const useGetProvinces = ({ countryCode, options }) => {
  const { data: provinces, isFetching: isProvincesFetching } = useQuery({
    queryKey: [ALL_PROVINCES_QUERY_KEY, countryCode],
    queryFn: () => getBillingProvinceOptions(countryCode),
    enabled: !!countryCode,
    ...options,
  });

  return {
    provinces,
    isProvincesFetching,
  };
};
