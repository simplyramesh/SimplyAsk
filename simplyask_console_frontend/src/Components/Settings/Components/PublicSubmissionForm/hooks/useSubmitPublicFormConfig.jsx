import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitPublicFormConfig } from '../../../../../Services/axios/workflowEditor';
import { PUBLIC_FORM_QUERY_KEYS } from '../utils/constants';

const useSubmitPublicFormConfig = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: submitPublicFormConfigValues, isPending: isSubmitPublicFormConfigValuesLoading } = useMutation({
    mutationFn: (payload) => submitPublicFormConfig(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [PUBLIC_FORM_QUERY_KEYS.GET_PUBLIC_FORM_CONFIG],
      });

      onSuccess?.(data);
    },
    onError,
  });
  return { submitPublicFormConfigValues, isSubmitPublicFormConfigValuesLoading };
};

export default useSubmitPublicFormConfig;
