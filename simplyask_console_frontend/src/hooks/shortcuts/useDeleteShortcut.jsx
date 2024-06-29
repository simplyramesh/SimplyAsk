import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GET_SHORTCUTS } from './useShortcuts';
import { deleteShortcut } from '../../Services/axios/shortcuts';

export const useDeleteShortcut = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeShortcut, isLoading } = useMutation({
    mutationFn: async (id) => deleteShortcut(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SHORTCUTS] });

      toast.success('Shortcut deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting shortcut');
    },
  });

  return {
    removeShortcut,
    isLoading,
  };
};
