import { useQueries } from '@tanstack/react-query';

import { getProductInventoryById } from '../../../Services/axios/productInventory';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';

export const useGetMultipleProductInventory = ({ queryKey = PRODUCT_QUERY_KEYS.PRODUCT_INVENTORY, ids = [] }) => {
  const queries = ids.map((id) => ({
    queryKey: [queryKey, id],
    queryFn: () => getProductInventoryById(id),
  }));

  const inventories = useQueries({ queries });

  return {
    inventories: inventories.map((inventory) => inventory.data),
    isFetching: inventories.some((inventory) => inventory.isFetching),
  };
};
