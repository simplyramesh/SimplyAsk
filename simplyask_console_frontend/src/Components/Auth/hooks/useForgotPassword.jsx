import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../../Services/axios/authAxios';

const useForgotPassword = ({ onSuccess, onError }) => {
  const { mutate: resetPasswordMutate, isPending: isResetPasswordLoading } = useMutation({
    mutationFn: async ({ email }) => resetPassword(email),
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    resetPassword: resetPasswordMutate,
    isResetPasswordLoading,
  };
};

export default useForgotPassword;
