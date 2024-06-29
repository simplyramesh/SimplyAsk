import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import { updateIssues } from '../../Services/axios/issuesAxios';

export const useServiceTicketUpdate = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateServiceTicket,
    mutateAsync: updateServiceTicketAsync,
    isPending: isServiceTicketLoading,
  } = useMutation({
    mutationFn: async (data) => {
      const {
        ticket, assignedTo, assignedBy, issueStatusId,
      } = data;
      const assignedToUserId = assignedTo || assignedTo === null ? assignedTo : ticket.assignedTo?.id || null;

      return updateIssues([
        {
          issueId: ticket.id,
          dueDate: ticket.dueDate,
          assignedToUserId,
          ...(issueStatusId ? { issueStatusId } : {}),
          ...(assignedBy ? { assignedByUserId: assignedBy } : {}),
        },
      ]);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] });

      toast.success('Ticket updated successfully');

      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Error updating ticket');

      onError?.(error);
    },
  });

  return {
    updateServiceTicket,
    updateServiceTicketAsync,
    isServiceTicketLoading,
  };
};
