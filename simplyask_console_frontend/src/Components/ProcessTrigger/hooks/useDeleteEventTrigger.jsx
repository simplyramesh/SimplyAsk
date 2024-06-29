import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteEventTriggers } from '../../../Services/axios/webhook';

export const useDeleteEventTrigger = ({ queryKey, onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (ids) => {
      return Array.isArray(ids) ? deleteEventTriggers(`?${ids.join('&')}`) : deleteEventTriggers(`/${ids}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onSuccess?.({ data, variables });
      toast.success(
        `Event ${Array.isArray(variables) && variables.length > 1 ? 'Triggers' : 'Trigger'} deleted successfully`
      );
    },
    onError: (error, variables) => {
      onError?.({ error, variables });
      toast.error(`Event ${Array.isArray(variables) && variables.length > 1 ? 'Triggers' : 'Trigger'} delete failed`);
    },
  });

  return {
    mutate,
    isLoading,
  };
};
