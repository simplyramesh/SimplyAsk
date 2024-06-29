import { useQuery } from '@tanstack/react-query';

import { getBulkedLinkedData } from '../../../../Services/axios/test';

export const GET_BULK_LINKAGES = 'getBulkLinkages';

export const useGetBulkLinkages = (genericBulkRequestIds) => {
  const { data: bulkDataLinkages, ...rest } = useQuery({
    queryKey: [GET_BULK_LINKAGES, genericBulkRequestIds],
    queryFn: () => getBulkedLinkedData(genericBulkRequestIds),
    enabled: !!(
      genericBulkRequestIds?.testCaseId?.length ||
      genericBulkRequestIds?.testSuiteId?.length ||
      genericBulkRequestIds?.testGroupId?.length
    ),
  });

  return {
    bulkDataLinkages,
    ...rest,
  };
};
