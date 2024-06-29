import { useQuery } from '@tanstack/react-query';

import { getCatalogProductCategories, getCatalogProductCategoryById } from '../../../Services/axios/productCatalog';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';
import { removeEmptyFilterParams } from '../utils/helpers';

const useGetProductCategories = ({
  id = '',
  queryKey = PRODUCT_QUERY_KEYS.CATEGORIES,
  filterParams = {},
  options = {},
}) => {
  const filterQuery = removeEmptyFilterParams(filterParams);

  const { data: categories, ...rest } = useQuery({
    queryKey: [queryKey, id, filterQuery],
    queryFn: () => (id ? getCatalogProductCategoryById(id, filterQuery) : getCatalogProductCategories(filterQuery)),
    ...options,
  });

  return {
    categories,
    ...rest,
  };
};

export default useGetProductCategories;
