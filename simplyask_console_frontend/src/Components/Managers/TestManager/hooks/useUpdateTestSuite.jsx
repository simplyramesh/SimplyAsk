import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateTestSuite } from '../../../../Services/axios/test';

import { GET_TEST_SUITE_QUERY_KEY } from './useGetTestSuite';

export const UPDATE_TEST_SUITE_QUERY_KEY = 'updateTestSuite';

export const useUpdateTestSuite = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateTestSuiteFn, isLoading: isUpdating } = useMutation({
    mutationFn: async (params) => updateTestSuite(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_TEST_SUITE_QUERY_KEY] });

      toast.success('Test Suite updated successfully');

      onSuccess?.();
    },
    onError: () => {
      toast.error('Error updating Test Suite');
    },
  });

  const changeFavouriteTestSuite = (testSuiteId, isFavourite) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { isFavourite } });
  const changeArchivedTestSuite = (testSuiteId, isArchived) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { isArchived } });
  const assignTestCases = (testSuiteId, testCaseIds) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { addedTestCaseId: testCaseIds } });
  const assignTestGroups = (testSuiteId, testGroupIds) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { addedGroupId: testGroupIds } });
  const unassignTestCases = (testSuiteId, testCaseIds) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { removedTestCaseId: testCaseIds } });
  const unassignTestGroups = (testSuiteId, testGroupIds) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { removedGroupId: testGroupIds } });
  const updateDescription = (testSuiteId, description) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { description } });
  const updateDisplayName = (testSuiteId, displayName) =>
    updateTestSuiteFn({ id: testSuiteId, payload: { displayName } });
  const updateTags = (testSuiteId, tags) => updateTestSuiteFn({ id: testSuiteId, payload: { tags } });

  return {
    updateTestCase: updateTestSuiteFn,
    changeFavouriteTestSuite,
    changeArchivedTestSuite,
    assignTestCases,
    assignTestGroups,
    unassignTestCases,
    unassignTestGroups,
    updateDescription,
    updateDisplayName,
    updateTags,
    isUpdating,
  };
};
