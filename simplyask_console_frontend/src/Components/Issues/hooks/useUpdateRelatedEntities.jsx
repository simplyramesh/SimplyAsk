import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIssuesRelatedEntities } from '../../../Services/axios/issuesAxios';
import { ISSUES_QUERY_KEYS } from '../constants/core';

export const useUpdateRelatedEntities = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateRelatedEntities, isLoading: isUpdateRelatedEntitiesLoading } = useMutation({
    mutationFn: ({ params, body }) => updateIssuesRelatedEntities(params, body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    updateRelatedEntities,
    isUpdateRelatedEntitiesLoading,
  };
};
