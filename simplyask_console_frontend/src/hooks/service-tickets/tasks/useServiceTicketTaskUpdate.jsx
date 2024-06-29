import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ISSUES_QUERY_KEYS } from '../../../Components/Issues/constants/core';
import { updateIssues } from '../../../Services/axios/issuesAxios';

export const useServiceTicketTaskUpdate = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateServiceTicketTask,
    mutateAsync: updateServiceTicketTaskAsync,
    isPending: isServiceTicketTaskUpdateLoading,
  } = useMutation({
    mutationFn: async ({ task, assignedTo, assignedBy, issueStatusId, resolvedBy }) => {
      const assignedToUserId = assignedTo || assignedTo === null ? assignedTo : task.assignedTo?.id || null;

      return updateIssues([
        {
          issueId: task.id,
          dueDate: task.dueDate || null,
          assignedToUserId,
          ...(issueStatusId && { issueStatusId }),
          ...(resolvedBy && { resolvedBy }),
          ...(assignedBy ? { assignedByUserId: assignedBy } : {}),
        },
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] });

      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Creating Service Ticket Task error');

      onError?.(error);
    },
  });

  return {
    updateServiceTicketTask,
    updateServiceTicketTaskAsync,
    isServiceTicketTaskUpdateLoading,
  };
};
