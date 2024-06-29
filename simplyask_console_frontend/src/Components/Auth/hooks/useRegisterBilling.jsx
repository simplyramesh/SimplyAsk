import { useMutation } from '@tanstack/react-query';

import { registerBillingWithTokenId } from '../../../Services/axios/authAxios';

const useRegisterBilling = ({ onSuccess, onError } = {}) => {
  const { mutate: registerBilling, isPending: isBillingRegistrationLoading } = useMutation({
    mutationFn: async ({ payload, registrationId }) => registerBillingWithTokenId(registrationId, payload),
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    registerBilling,
    isBillingRegistrationLoading,
  };
};

export default useRegisterBilling;

