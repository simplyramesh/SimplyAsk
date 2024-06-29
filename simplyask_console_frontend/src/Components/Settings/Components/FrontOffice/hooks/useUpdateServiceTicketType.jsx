import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateIssuesTypesConfig } from '../../../../../Services/axios/issuesAxios';
import { ISSUES_QUERY_KEYS } from '../../../../Issues/constants/core';

const useUpdateServiceTicketType = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: updateServiceTicketType, isPending: isUpdateServiceTicketTypeLoading } = useMutation({
    mutationFn: async (body) => {
      const payload = Array.isArray(body) ? body : [body];

      return updateIssuesTypesConfig(payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_CONFIGURATIONS] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_CATEGORY_CONFIG] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TYPE_DISPLAY_NAME] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_BY_ID] });
      onSuccess?.({ data, variables });
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return { updateServiceTicketType, isUpdateServiceTicketTypeLoading };
};

export default useUpdateServiceTicketType;
