import { useQuery } from '@tanstack/react-query';

import { getProductOrderCustomers } from '../../../Services/axios/productOrder';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';
import { removeEmptyFilterParams } from '../utils/helpers';

const useGetProductCustomer = ({ queryKey = PRODUCT_QUERY_KEYS.CUSTOMERS, filterParams = {}, options = {} }) => {
  const filterQuery = removeEmptyFilterParams(filterParams);

  const { data: customers, ...rest } = useQuery({
    queryKey: [queryKey, filterQuery],
    queryFn: () => getProductOrderCustomers(filterQuery),
    ...options,
  });

  return {
    customers,
    ...rest,
  };
};

export default useGetProductCustomer;
