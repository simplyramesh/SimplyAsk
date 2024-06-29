import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteIssuesTypesStatuses } from '../../../../../Services/axios/issuesAxios';
import { ISSUES_QUERY_KEYS } from '../../../../Issues/constants/core';

const useDeleteServiceTicketTypeStatuses = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteServiceTicketTypeStatuses, isLoading: isDeleteServiceTicketTypeStatusesLoading } = useMutation({
    mutationFn: async (id) => {
      const ids = Array.isArray(id) ? id : [id];

      return deleteIssuesTypesStatuses(ids);
    },
    onSuccess: ({ data, variables }) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_BY_ID] });

      onSuccess?.({
        data,
        variables,
      });
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    deleteServiceTicketTypeStatuses,
    isDeleteServiceTicketTypeStatusesLoading,
  };
};

export default useDeleteServiceTicketTypeStatuses;
