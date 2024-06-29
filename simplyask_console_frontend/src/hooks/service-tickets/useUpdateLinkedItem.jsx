import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import { updateIssues } from '../../Services/axios/issuesAxios';
import { cloneDeep } from 'lodash';

export const useUpdateLinkedItem = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateServiceTicket,
    mutateAsync: updateServiceTicketAsync,
    isLoading: isServiceTicketLoading,
  } = useMutation({
    mutationFn: async (data) => {
      const { ticket, assignedTo, assignedBy, issueStatusId } = data;
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
    onMutate: async (newData) => {
      const { ticketId, relatedEntityId, newStatus, ticket } = newData;
      await queryClient.cancelQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId] });
      const parentTicket = queryClient.getQueryData([ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId]);
      const parentTicketCopy = cloneDeep(parentTicket);
      const entityToBeUpdatedIdx = parentTicket.relatedEntities.findIndex((entity) => entity.id === relatedEntityId);
      const newRelatedEntities = [...parentTicket.relatedEntities];

      newRelatedEntities[entityToBeUpdatedIdx] = {
        ...parentTicket.relatedEntities[entityToBeUpdatedIdx],
        relatedEntity: { ...ticket, status: newStatus },
      };

      queryClient.setQueryData([ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId], {
        ...parentTicket,
        relatedEntities: newRelatedEntities,
      });

      return { prevValue: parentTicketCopy, newValue: parentTicket };
    },
    onSuccess: (data) => {
      toast.success('Ticket updated successfully');

      onSuccess?.(data);
    },
    onError: (error, context) => {
      const { prevValue } = context;
      queryClient.setQueryData([ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, context.ticketId], prevValue);
      toast.error('Error updating ticket');

      onError?.(error);
    },
    onSettled: (data, error, context) => {
      const { ticketId } = context;
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] });
    },
  });

  return {
    updateServiceTicket,
    updateServiceTicketAsync,
    isServiceTicketLoading,
  };
};
