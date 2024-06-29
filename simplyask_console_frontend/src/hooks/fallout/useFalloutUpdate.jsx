import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateIssues } from '../../Services/axios/issuesAxios';
import { ISSUE_FALLOUT_STATUSES } from '../../Components/Issues/constants/core';

export const useFalloutUpdate = ({ onSuccess, onError, invalidateQueries = [] } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateFalloutTicket,
    mutateAsync: updateFalloutTicketAsync,
    isLoading: isFalloutLoading,
  } = useMutation({
    mutationFn: async (data) => {
      const {
        ticket, assignedTo, assignedBy, issueStatusId, newStatus
      } = data;
      const assignedToUserId = assignedTo || assignedTo === null
        ? assignedTo
        : ticket.assignedTo?.id || null;

      return updateIssues([{
        issueId: ticket.id,
        dueDate: ticket.dueDate,
        assignedToUserId,
        ...(issueStatusId ? { issueStatusId } : {}),
        ...(assignedBy ? { assignedByUserId: assignedBy } : {}),
        resolvedBy: newStatus === ISSUE_FALLOUT_STATUSES.RESOLVED || newStatus === ISSUE_FALLOUT_STATUSES.FORCE_RESOLVED ? 'USER' : null
      }]);
    },
    onSuccess: (data) => {
      ['getActiveTicketByFalloutId', 'getIndividualFalloutTickets', 'getFalloutTicketDetails']
        .concat(invalidateQueries)
        .forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });

      toast.success('Ticket updated successfully');

      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Error updating ticket');

      onError?.(error);
    },
  });

  return {
    updateFalloutTicket,
    updateFalloutTicketAsync,
    isFalloutLoading,
  };
};
