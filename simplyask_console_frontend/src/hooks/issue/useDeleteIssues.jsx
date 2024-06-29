import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import { deleteIssues } from '../../Services/axios/issuesAxios';

export const useDeleteIssues = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: removeIssues, isPending: isRemoveIssuesLoading } = useMutation({
    mutationFn: (ids) => {
      return deleteIssues(ids);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] });

      onSuccess?.({ data, variables });
    },
    onError: (error, variables) => {
      onError?.({ error, variables });
    },
  });

  return {
    removeIssues,
    isRemoveIssuesLoading,
  };
};
