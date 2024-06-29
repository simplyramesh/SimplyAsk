import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIssuesRelatedEntities } from '../../../Services/axios/issuesAxios';
import { cloneDeep } from 'lodash';

export const useRemoveLinkedServiceTicket = ({ onSuccess, onError, queryKey } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: removeLinkedServiceTicket, isPending: isRemovingLinkedServiceTicket } = useMutation({
    mutationFn: ({ params, body }) => updateIssuesRelatedEntities(params, body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.({ data, variables });
    },
    onMutate: async (data) => {
      const {
        params: { deletedTicket },
      } = data;
      await queryClient.cancelQueries({ queryKey });

      const currentData = queryClient.getQueryData(queryKey);
      const newDataCopy = cloneDeep(currentData);
      const newRelatedEntities = newDataCopy.relatedEntities.filter((currEntity) => currEntity.id !== deletedTicket);

      newDataCopy.relatedEntities = newRelatedEntities;
      queryClient.setQueryData(queryKey, newDataCopy);

      return { previousData: currentData, newData: currentData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err, _newData, context) => {
      queryClient.setQueryData(queryKey, context.previousData);
      onError?.();
    },
  });

  return {
    removeLinkedServiceTicket,
    isRemovingLinkedServiceTicket,
  };
};
