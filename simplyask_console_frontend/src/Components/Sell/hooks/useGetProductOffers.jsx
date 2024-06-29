import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCatalogProducts } from '../../../Services/axios/productCatalog';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';
import { removeEmptyFilterParams } from '../utils/helpers';

const useGetProductOffers = ({ queryKey = PRODUCT_QUERY_KEYS.OFFERINGS, filterParams = {}, options = {} }) => {
  // NOTE: This is a solution for showing all filters
  // without an additional API request
  const [unfilteredProducts, setUnfilteredProducts] = useState(null);

  const filterQuery = removeEmptyFilterParams(filterParams);

  const { data, ...rest } = useQuery({
    queryKey: [queryKey, filterQuery],
    queryFn: () => getCatalogProducts(filterQuery),
    ...options,
  });

  useEffect(() => {
    if (!unfilteredProducts && data) setUnfilteredProducts(data);
  }, [data]);

  return {
    products: data,
    unfilteredProducts,
    ...rest,
  };
};

export default useGetProductOffers;
