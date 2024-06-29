import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import { updateIssuesAdditionalFields } from '../../Services/axios/issuesAxios';

const useUpdateIssueAdditionalFields = ({ onError, onSuccess, onSettled } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateIssueAdditionalFields, isPending: isAdditionalFieldsUpdating } = useMutation({
    mutationFn: ({ params, body }) => updateIssuesAdditionalFields(params, body),
    onMutate: async (variables) => {
      const previousTicketById = queryClient.getQueryData([
        ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID,
        variables.params.issueId,
      ]);

      queryClient.setQueryData([ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, variables.params.issueId], {
        ...previousTicketById,
        additionalFields: { ...previousTicketById.additionalFields, ...variables.body },
      });
      return { previousTicketById };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, variables.params.issueId],
        context.previousTicketById
      );
      onError?.(err);
    },
    onSuccess: (data, variables) => {
      onSuccess?.({ data, variables });
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables, context);
    },
  });

  return {
    updateIssueAdditionalFields,
    isAdditionalFieldsUpdating,
  };
};

export default useUpdateIssueAdditionalFields;
