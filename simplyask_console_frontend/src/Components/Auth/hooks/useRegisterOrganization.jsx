import { useMutation } from '@tanstack/react-query';

import { registerOrganizationWithTokenId } from '../../../Services/axios/authAxios';

const useRegisterOrganization = ({ onSuccess, onError } = {}) => {
  const { mutate: registerOrganization, isPending: isorganizationRegistrationLoading } = useMutation({
    mutationFn: async ({ payload, registrationId }) => registerOrganizationWithTokenId(registrationId, payload),
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    registerOrganization,
    isorganizationRegistrationLoading,
  };
};

export default useRegisterOrganization;


