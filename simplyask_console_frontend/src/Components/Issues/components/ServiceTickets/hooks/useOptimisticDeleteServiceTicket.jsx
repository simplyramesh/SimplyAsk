import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';

import { deleteIssues } from '../../../../../Services/axios/issuesAxios';

export const useOptimisticDeleteServiceTicket = ({
  queryKey,
  onSuccess,
  onError,
  isTicketDetailsFullView = false,
} = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (ids) => deleteIssues(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey });

      if (isTicketDetailsFullView) return;

      const currentData = queryClient.getQueryData(queryKey);
      const newDataCopy = cloneDeep(currentData);
      const deletingItemsIdx = ids.map((id) => newDataCopy.content.findIndex((issue) => issue.id === id));

      deletingItemsIdx.forEach((idx) => {
        newDataCopy.content.splice(idx, 1, { ...newDataCopy.content[idx], isDeleting: true });
      });

      queryClient.setQueryData(queryKey, newDataCopy);

      return { prevData: currentData, newData: newDataCopy };
    },
    onSettled: (_data, _error) => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: (data, variables) => {
      onSuccess?.({ data, variables });
    },
    onError: (error, variables, context) => {
      onError?.({ error, variables });
      queryClient.setQueryData(queryKey, context.prevData);
    },
  });

  return {
    mutate,
    isLoading,
  };
};
