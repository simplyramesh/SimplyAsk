import { useQueries } from '@tanstack/react-query';

import { getCatalogProductsById } from '../../../Services/axios/productCatalog';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';

const useGetProductOfferById = ({ queryKey = PRODUCT_QUERY_KEYS.OFFERINGS_BY_ID, ids = [], select, options = {} }) => {
  const idArr = Array.isArray(ids) ? ids : [ids];

  const queries = idArr?.map((id) => ({
    queryKey: [queryKey, id],
    queryFn: () => getCatalogProductsById(id),
    enabled: ids.length > 0,
    ...options,
    select: (resData) => select?.(resData, id),
  }));

  const products = useQueries({ queries });
  const isFetching = products.some((p) => p.isFetching);

  return {
    product: products.map((product) => product?.data),
    isFetching,
  };
};

export default useGetProductOfferById;
