import { useQuery } from '@tanstack/react-query';

import { getTestGenericType } from '../../../../Services/axios/test';
import { TEST_ENTITY_TYPE } from '../constants/constants';

export const TEST_GROUP_LINKAGES_QUERY_KEY = 'getGroupLinkages';

const useGetTestGroupLinkages = ({ multipleSearchText, individualSearchText, options = {} }) => {
  const searchText = multipleSearchText || individualSearchText || '';
  const { data: testGroupLinkages, ...rest } = useQuery({
    queryKey: [TEST_GROUP_LINKAGES_QUERY_KEY, searchText],
    queryFn: () => getTestGenericType(TEST_ENTITY_TYPE.GROUP, searchText),
    ...options,
  });

  return {
    testGroupLinkages,
    ...rest,
  };
};

export default useGetTestGroupLinkages;
