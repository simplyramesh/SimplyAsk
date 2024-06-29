import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { patchEditUser } from '../../../../Services/axios/permissionsUsers';

export const usePatchEditUser = ({
  invalidateQueryKey,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  const { mutate: patchEditUserApi, isPending: isPatchEditUserApiLoading } = useMutation({
    mutationFn: (payload) => patchEditUser(payload.userId, payload.userPayload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
      onSuccess?.({ data, variables });
    },
    onError: () => {
      toast.error('Something went wrong');
      onError?.();
    },
  });

  return {
    patchEditUserApi,
    isPatchEditUserApiLoading,
  };
};
