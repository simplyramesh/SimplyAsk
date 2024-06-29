import { useQuery } from '@tanstack/react-query';

import { getTestGenericType } from '../../../../Services/axios/test';
import { TEST_ENTITY_TYPE } from '../constants/constants';

export const TEST_CASE_LINKAGES_QUERY_KEY = 'getCaseLinkages';

const useGetTestCaseLinkages = ({ multipleSearchText, individualSearchText, options = {} }) => {
  const searchText = multipleSearchText || individualSearchText || '';
  const { data: testCaseLinkages, ...rest } = useQuery({
    queryKey: [TEST_CASE_LINKAGES_QUERY_KEY, searchText],
    queryFn: () => getTestGenericType(TEST_ENTITY_TYPE.CASE, searchText),
    ...options,
  });

  return {
    testCaseLinkages,
    ...rest,
  };
};

export default useGetTestCaseLinkages;
