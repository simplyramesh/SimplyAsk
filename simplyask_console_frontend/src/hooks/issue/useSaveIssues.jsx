import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import { createIssue, updateIssues } from '../../Services/axios/issuesAxios';

// dueDate, assignedToUserId - should be included in BODY when updating
export const useSaveIssues = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: saveIssues, isLoading: isUpdateIssueLoading, isPending: isUpdateIssuePending } = useMutation({
    mutationFn: (data) => {
      const fn = Array.isArray(data) ? updateIssues : createIssue;
      return fn(data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_BY_ID] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    saveIssues,
    isUpdateIssueLoading,
    isUpdateIssuePending,
  };
};
