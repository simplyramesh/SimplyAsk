import { useQuery } from '@tanstack/react-query';

import { getTestGenericType } from '../../../../Services/axios/test';
import { TEST_ENTITY_TYPE } from '../constants/constants';

export const SUITE_LINKAGES_QUERY_KEY = 'getSuiteLinkages';

const useGetSuiteLinkages = ({ caseAndSuiteSearchText, suiteAndGroupSearchText, options = {} }) => {
  const searchText = caseAndSuiteSearchText || suiteAndGroupSearchText || '';

  const { data: testSuitesLinkages, ...rest } = useQuery({
    queryKey: [SUITE_LINKAGES_QUERY_KEY, searchText],
    queryFn: () => getTestGenericType(TEST_ENTITY_TYPE.SUITE, searchText),
    ...options,
  });

  return {
    testSuitesLinkages,
    ...rest,
  };
};

export default useGetSuiteLinkages;
