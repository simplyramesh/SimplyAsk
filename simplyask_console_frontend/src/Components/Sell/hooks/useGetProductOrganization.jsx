import { useQuery } from '@tanstack/react-query';

import { getCatalogProductOrganizations } from '../../../Services/axios/productCatalog';

export const PRODUCT_ORGANIZATIONS_QUERY_KEY = 'PRODUCT_ORGANIZATIONS_QUERY_KEY';

const useGetProductOrganization = ({ options = {} }) => {
  const { data, ...rest } = useQuery({
    queryKey: [PRODUCT_ORGANIZATIONS_QUERY_KEY],
    queryFn: () => getCatalogProductOrganizations(),
    ...options,
  });

  return {
    organizations: data,
    ...rest,
  };
};

export default useGetProductOrganization;
