import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteIssuesTypesConfig } from '../../../../../Services/axios/issuesAxios';
import { ISSUES_QUERY_KEYS } from '../../../../Issues/constants/core';

const useDeleteServiceTicketType = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteServiceTicketType, isLoading: isDeleteServiceTicketTypeLoading } = useMutation({
    mutationFn: async (id) => {
      const ids = Array.isArray(id) ? id : [id];

      return deleteIssuesTypesConfig(ids);
    },
    onSuccess: ({ data, variables }) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_CONFIGURATIONS] });

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
    deleteServiceTicketType,
    isDeleteServiceTicketTypeLoading,
  };
};

export default useDeleteServiceTicketType;
