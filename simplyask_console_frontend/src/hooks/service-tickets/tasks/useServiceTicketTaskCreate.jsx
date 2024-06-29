import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ISSUES_QUERY_KEYS } from '../../../Components/Issues/constants/core';
import { createIssue } from '../../../Services/axios/issuesAxios';

export const useServiceTicketTaskCreate = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: createServiceTicketTask,
    mutateAsync: createServiceTicketTaskAsync,
    isLoading: isServiceTicketTaskLoading,
  } = useMutation({
    mutationFn: async (data) => {
      return createIssue(data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID] });

      onSuccess?.({ data, variables });
    },
    onError: (error) => {
      toast.error('Creating Service Ticket Task error');

      onError?.(error);
    },
  });

  return {
    createServiceTicketTask,
    createServiceTicketTaskAsync,
    isServiceTicketTaskLoading,
  };
};
