import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SHORTCUTS } from './useShortcuts';
import { updateShortcuts } from '../../Services/axios/shortcuts';

export const useBulkUpdateShortcut = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: bulkUpdateShortcuts, isPending: isLoading } = useMutation({
    mutationFn: async (body) => updateShortcuts(body),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: [GET_SHORTCUTS] })
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData([GET_SHORTCUTS], context.prevShortcuts);
    },
  });

  return {
    bulkUpdateShortcuts,
    isLoading,
  };
};
