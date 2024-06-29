import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GET_SHORTCUTS } from './useShortcuts';
import { saveShortcut } from '../../Services/axios/shortcuts';

export const useCreateShortcut = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createShortcut, isLoading } = useMutation({
    mutationFn: async (body) => saveShortcut(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SHORTCUTS] });

      toast.success('Shortcut added successfully');
    },
    onError: () => {
      toast.error('Error creating shortcut');
    },
  });

  return {
    createShortcut,
    isLoading,
  };
};
