import { useQuery } from '@tanstack/react-query';
import { getBillingCountryOptions } from '../../../../../Services/axios/billing';

export const GET_BILLING_COUNTRIES = 'GET_BILLING_COUNTRIES';

const useGetBillingCountries = (rest = {}) => {
  const { data: countryDataOptions, isFetching: isFetchingCountries } = useQuery({
    queryKey: [GET_BILLING_COUNTRIES],
    queryFn: getBillingCountryOptions,
    ...rest,
  });

  return { countryDataOptions, isFetchingCountries };
};

export default useGetBillingCountries;
