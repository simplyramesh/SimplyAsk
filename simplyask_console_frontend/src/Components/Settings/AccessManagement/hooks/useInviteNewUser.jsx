import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { postInviteUser } from '../../../../Services/axios/permissionsUsers';

export const useInviteNewUser = ({
  invalidateQueryKey,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  const { mutate: inviteNewUser, isPending: isInviteNewUserLoading } = useMutation({
    mutationFn: (payload) => postInviteUser(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });

      onSuccess?.({ data, variables });
    },
    onError: (error) => {
      toast.error(error?.response?.data || 'Something went wrong');
      onError?.();
    },
  });

  return {
    inviteNewUser,
    isInviteNewUserLoading,
  };
};
