import { useMutation } from '@tanstack/react-query';

import { completeRegistrationWithTokenId } from '../../../Services/axios/authAxios';

const useCreateCustomerAccount = ({ onSuccess, onError } = {}) => {
  const { mutate: createCustomerAccount, isPending: isCustomerAccountCreationLoading } = useMutation({
    mutationFn: async ({ paymentIntent, registrationId, userAppliedPromoCodeId }) =>
      completeRegistrationWithTokenId(registrationId, userAppliedPromoCodeId, paymentIntent),
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    createCustomerAccount,
    isCustomerAccountCreationLoading,
  };
};

export default useCreateCustomerAccount;
