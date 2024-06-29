import { useMutation } from '@tanstack/react-query';

import { submitSupportRequest as submitSupportRequestApi } from '../../../Services/axios/Support';

const useSubmitSupportRequest = ({ onSuccess, onError }) => {
  const { mutate: submitSupportRequest, isPending: isSubmitSupportRequestLoading } = useMutation({
    mutationFn: (payload) => submitSupportRequestApi(payload),
    onSuccess,
    onError,
  });
  return {
    submitSupportRequest,
    isSubmitSupportRequestLoading,
  };
};

export default useSubmitSupportRequest;
