import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateTestCase } from '../../../../Services/axios/test';
import { GET_FILTERED_TEST_DATA } from './useGetFilteredTestData';
import { GET_TEST_CASE_QUERY_KEY } from './useGetTestCase';

export const UPDATE_TEST_CASE_QUERY_KEY = 'updateTestCase';

export const useUpdateTestCase = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateTestCaseFn, isLoading: isUpdating } = useMutation({
    mutationFn: async (params) => updateTestCase(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_TEST_CASE_QUERY_KEY, GET_FILTERED_TEST_DATA] });

      toast.success('Test Case updated successfully');

      onSuccess?.();
    },
    onError: () => {
      toast.error('Error updating Test Case');
    },
  });

  const changeFavouriteTestCase = (testCaseId, isFavourite) =>
    updateTestCaseFn({ id: testCaseId, payload: { isFavourite } });
  const changeArchivedTestCase = (testCaseId, isArchived) =>
    updateTestCaseFn({ id: testCaseId, payload: { isArchived } });
  const assignTestSuites = (testCaseId, testSuiteIds) =>
    updateTestCaseFn({ id: testCaseId, payload: { addedSuiteId: testSuiteIds } });
  const assignTestGroups = (testCaseId, testGroupIds) =>
    updateTestCaseFn({ id: testCaseId, payload: { addedGroupId: testGroupIds } });
  const unassignTestSuites = (testCaseId, testSuiteIds) =>
    updateTestCaseFn({ id: testCaseId, payload: { removedSuiteId: testSuiteIds } });
  const unassignTestGroups = (testCaseId, testGroupIds) =>
    updateTestCaseFn({ id: testCaseId, payload: { removedGroupId: testGroupIds } });
  const updateDescription = (testCaseId, description) => updateTestCaseFn({ id: testCaseId, payload: { description } });
  const updateDisplayName = (testCaseId, displayName) => updateTestCaseFn({ id: testCaseId, payload: { displayName } });
  const updateTags = (testCaseId, tags) => updateTestCaseFn({ id: testCaseId, payload: { tags } });

  return {
    updateTestCase: updateTestCaseFn,
    changeFavouriteTestCase,
    changeArchivedTestCase,
    assignTestSuites,
    assignTestGroups,
    unassignTestSuites,
    unassignTestGroups,
    updateDescription,
    updateDisplayName,
    updateTags,
    isUpdating,
  };
};
