import { useMutation } from '@tanstack/react-query';

import { resendRegistrationEmail } from '../../../Services/axios/authAxios';

const useResendEmail = ({ onSuccess, onError } = {}) => {
  const { mutate: resendEmail, isPending: isEmailResendLoading } = useMutation({
    mutationFn: async (payload) => resendRegistrationEmail(payload),
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    resendEmail,
    isEmailResendLoading,
  };
};

export default useResendEmail;

