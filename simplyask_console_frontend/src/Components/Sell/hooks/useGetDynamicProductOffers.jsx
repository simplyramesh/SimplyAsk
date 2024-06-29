import { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';

import { getCatalogProducts } from '../../../Services/axios/productCatalog';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';
import { removeEmptyFilterParams } from '../utils/helpers';

const useGetDynamicProductOffers = ({
  queryKey = PRODUCT_QUERY_KEYS.OFFERINGS,
  categories = [],
  filterParams = {},
  options = {},
  select,
}) => {
  // NOTE: This is a solution for showing all filters
  // without an additional API request
  const [unfilteredProducts, setUnfilteredProducts] = useState(null);

  const filterQuery = removeEmptyFilterParams(filterParams);

  const queries = categories?.map((category) => ({
    queryKey: [queryKey, { ...filterQuery, category: category?.name }],
    queryFn: () => getCatalogProducts({ ...filterQuery, category: category?.name }),
    ...options,
    select: (resData) => select?.(resData, category),
  }));

  const categoryProducts = useQueries({ queries });
  const isFetching = categoryProducts.some((cp) => cp.isFetching);

  useEffect(() => {
    if (!isFetching && unfilteredProducts?.length < 1 && categoryProducts) {
      const allProducts = categoryProducts.reduce((acc, categoryProduct) => {
        if (!categoryProduct?.data) return acc;

        const categoryProductData = Object.values(categoryProduct?.data)?.[0]?.map(({ product }) => product);

        return [...acc, ...categoryProductData];
      }, []);
      setUnfilteredProducts(allProducts);
    }
  }, [categoryProducts, isFetching]);

  return {
    unfilteredProducts,
    products: categoryProducts?.reduce((acc, categoryProduct) => {
      if (!categoryProduct?.data) return acc;

      return {
        ...acc,
        ...categoryProduct?.data,
      };
    }, {}),
    isFetching,
  };
};

export default useGetDynamicProductOffers;
