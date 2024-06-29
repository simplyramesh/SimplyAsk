import { useQuery } from '@tanstack/react-query';

import { getProductOrder, getProductOrderById } from '../../../Services/axios/productOrder';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';

const useGetProductOrder = ({ id = '', queryKey = PRODUCT_QUERY_KEYS.ORDERS, filterParams = {}, options = {} }) => {
  const { data: orders, ...rest } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => (id ? getProductOrderById(id) : getProductOrder(filterParams)),
    ...options,
  });

  return {
    orders,
    ...rest,
  };
};

export default useGetProductOrder;
