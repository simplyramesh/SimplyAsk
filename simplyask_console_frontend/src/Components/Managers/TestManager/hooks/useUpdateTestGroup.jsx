import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateTestGroup } from '../../../../Services/axios/test';

import { GET_TEST_GROUP_QUERY_KEY } from './useGetTestGroup';

export const UPDATE_TEST_GROUP_QUERY_KEY = 'updateTestGroup';

export const useUpdateTestGroup = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateTestGroupFn, isLoading: isUpdating } = useMutation({
    mutationFn: async (params) => updateTestGroup(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_TEST_GROUP_QUERY_KEY] });

      toast.success('Test Group updated successfully');

      onSuccess?.();
    },
    onError: () => {
      toast.error('Error updating Test Group');
    },
  });

  const changeFavouriteTestGroup = (testGroupId, isFavourite) =>
    updateTestGroupFn({ id: testGroupId, payload: { isFavourite } });
  const changeArchivedTestGroup = (testGroupId, isArchived) =>
    updateTestGroupFn({ id: testGroupId, payload: { isArchived } });
  const assignTestCases = (testGroupId, testCaseIds) =>
    updateTestGroupFn({ id: testGroupId, payload: { addedTestCaseId: testCaseIds } });
  const unassignTestCases = (testGroupId, testCaseIds) =>
    updateTestGroupFn({ id: testGroupId, payload: { removedTestCaseId: testCaseIds } });
  const assignTestSuites = (testGroupId, testSuiteIds) =>
    updateTestGroupFn({ id: testGroupId, payload: { addedSuiteId: testSuiteIds } });
  const unassignTestSuites = (testGroupId, testSuiteIds) =>
    updateTestGroupFn({ id: testGroupId, payload: { removedSuiteId: testSuiteIds } });
  const updateDescription = (testGroupId, description) =>
    updateTestGroupFn({ id: testGroupId, payload: { description } });
  const updateDisplayName = (testGroupId, displayName) =>
    updateTestGroupFn({ id: testGroupId, payload: { displayName } });
  const updateTags = (testGroupId, tags) => updateTestGroupFn({ id: testGroupId, payload: { tags } });

  return {
    updateTestGroup: updateTestGroupFn,
    changeFavouriteTestGroup,
    changeArchivedTestGroup,
    assignTestCases,
    unassignTestCases,
    assignTestSuites,
    unassignTestSuites,
    updateDescription,
    updateDisplayName,
    updateTags,
    isUpdating,
  };
};
