import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { performTestAction } from '../../../../Services/axios/test';
import { TEST_ACTION } from '../constants/constants';
import { TEST_TYPE } from '../utils/constants';
import { GET_FILTERED_TEST_DATA } from './useGetFilteredTestData';

export const PERFORM_TEST_ACTION = 'performTestAction';

export const usePerformTestAction = ({ onSuccess, invalidateQueries = [] } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: performTestActionFn, isLoading: isActionPeforming } = useMutation({
    mutationFn: async (params) => performTestAction(params.action, params.payload, params.queryParams),
    onSuccess: (data, variables) => {
      invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      queryClient.invalidateQueries({ queryKey: [GET_FILTERED_TEST_DATA] });

      if (data?.actionPerformed === TEST_ACTION.EXECUTE) {
        const errorResults = data?.actionResults.filter((result) => result.status !== 'OK');
        const successResults = data?.actionResults.filter((result) => result.status === 'OK');

        if (errorResults.length > 0 && successResults.length <= 0) {
          errorResults.forEach((errorResult) => {
            toast.error(errorResult?.error);
          });
        } else if (errorResults.length > 0 && successResults.length > 0) {
          errorResults.forEach((errorResult) => {
            toast.error(errorResult?.error);
          });
          toast.success(variables?.actionMessage);
        } else {
          toast.success(variables?.actionMessage);
        }
      } else {
        toast.success(variables?.actionMessage);
      }

      onSuccess?.();
    },
    onError: () => {
      toast.error('An error has occurred and action could not be performed');
    },
  });

  const getPretext = (payload) => {
    const typeMapping = {
      testCaseExecutionId: TEST_TYPE.TEST_CASE,
      testCaseId: TEST_TYPE.TEST_CASE,
      testSuiteExecutionId: TEST_TYPE.TEST_SUITE,
      testSuiteId: TEST_TYPE.TEST_SUITE,
      testGroupExecutionId: TEST_TYPE.TEST_GROUP,
      testGroupId: TEST_TYPE.TEST_GROUP,
    };

    const getMessage = (count, type) => (count > 1 ? `${count} records have` : `${type} has`);

    const foundProperties = Object.keys(typeMapping).filter((prop) => payload?.[prop]?.length > 0);
    let message = 'Record has';

    if (foundProperties?.length > 0) {
      const totalRecords = foundProperties.reduce((total, prop) => total + payload[prop].length, 0);
      message = getMessage(totalRecords, typeMapping[foundProperties[0]]);
    }

    return message;
  };

  const performExecute = (payload, queryParams) =>
    performTestActionFn({
      action: TEST_ACTION.EXECUTE,
      payload,
      queryParams,
      actionMessage: 'Execute action performed successfully',
    });
  const performReexecute = (payload, queryParams) =>
    performTestActionFn({
      action: TEST_ACTION.REEXECUTE,
      payload,
      queryParams,
      actionMessage: 'Re-execute action performed successfully',
    });
  const performStop = (payload, queryParams) =>
    performTestActionFn({
      action: TEST_ACTION.STOP,
      payload,
      queryParams,
      actionMessage: 'Stop action performed successfully',
    });
  const performDelete = (payload) =>
    performTestActionFn({
      action: TEST_ACTION.DELETE,
      payload,
      actionMessage: `${getPretext(payload)} been deleted`,
    });
  const performArchive = (payload) =>
    performTestActionFn({
      action: TEST_ACTION.ARCHIVE,
      payload,
      actionMessage: `${getPretext(payload)} been archived`,
    });
  const performUnarchive = (payload) =>
    performTestActionFn({
      action: TEST_ACTION.UNARCHIVE,
      payload,
      actionMessage: `${getPretext(payload)} been unarchived`,
    });
  const performFavourite = (payload) =>
    performTestActionFn({
      action: TEST_ACTION.FAVOURITE,
      payload,
      actionMessage: `${getPretext(payload)} been favourited`,
    });
  const performUnfavourite = (payload) =>
    performTestActionFn({
      action: TEST_ACTION.UNFAVOURITE,
      payload,
      actionMessage: `${getPretext(payload)} been unfavourited`,
    });

  return {
    performExecute,
    performReexecute,
    performStop,
    performDelete,
    performArchive,
    performUnarchive,
    performFavourite,
    performUnfavourite,
    isActionPeforming,
  };
};
