import { useMutation } from '@tanstack/react-query';

import { registerCustomerAndGetTokenId } from '../../../Services/axios/authAxios';

const useRegisterCustomer = ({ onSuccess, onError } = {}) => {
  const { mutate: registerCustomer, isPending: isCustomerRegistrationLoading } = useMutation({
    mutationFn: async ({ payload, registrationId }) => registerCustomerAndGetTokenId(payload, registrationId),
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    registerCustomer,
    isCustomerRegistrationLoading,
  };
};

export default useRegisterCustomer;

