import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { getFilteredIssues } from '../../Services/axios/issuesAxios';
import { issuesCategories } from '../../store';

// The issueCategory, issueType, and issueStatus are useful for singular filtering purposes (e.g. for non-table related components)
const useGetIssues = ({
  queryKey = '',
  filterParams = {},
  options = {},
  issueCategory = '',
  issueType = '',
  issueStatus = '',
}) => {
  const issueCategories = useRecoilValue(issuesCategories);

  const issuesCategoryIds = issueCategories?.reduce((acc, { id, name }) => ({ ...acc, [name]: id }), {});
  const issuesTypeIds = issueCategories?.reduce((acc, { types }) => {
    const typesIds = types?.reduce((acc, { id, name }) => ({ ...acc, [name]: id }), {});

    return { ...acc, ...typesIds };
  }, {});

  const issuesStatusIds = issueCategories?.reduce((acc, { statuses }) => {
    const statusesIds = statuses?.reduce(
      (acc, { relatedTypeId, name, id }) => (issuesTypeIds[issueType] === relatedTypeId ? { ...acc, [name]: id } : acc),
      {}
    );

    return { ...acc, ...statusesIds };
  }, {});

  const issuesQueryKey = queryKey ?? 'getIssues';

  const filterParamsWithEnums = {
    ...(issueCategory && {
      issueCategoryId: issuesCategoryIds[issueCategory] ? [issuesCategoryIds[issueCategory]] : [],
    }),
    ...(issueType && { issueTypeId: [issuesTypeIds[issueType]] }),
    ...(issueStatus && { issueStatusId: [issuesStatusIds[issueStatus]] }),
    isAscending: false,
    ...filterParams,
  };

  const { data: issues, ...restIssues } = useQuery({
    queryKey: [issuesQueryKey, filterParamsWithEnums],
    queryFn: () => getFilteredIssues(filterParamsWithEnums),
    ...options,
  });

  return {
    issues,
    ...restIssues,
  };
};

export default useGetIssues;
