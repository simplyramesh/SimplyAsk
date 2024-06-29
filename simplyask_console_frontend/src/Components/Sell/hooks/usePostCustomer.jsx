import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postProductOrderCustomer } from '../../../Services/axios/productOrder';

const usePostCustomer = ({ invalidateQueries = [], onCreateCustomerSuccess, onCreateCustomerError }) => {
  const queryClient = useQueryClient();

  const {
    data: responseData,
    mutate: createCustomer,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload) => postProductOrderCustomer(payload),
    onSuccess: (data, variables, context) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      onCreateCustomerSuccess?.(data, variables, context);
    },
    onError: (err) => onCreateCustomerError?.(err),
  });

  return {
    responseData,
    createCustomer,
    isLoading,
    isError,
    error,
  };
};

export default usePostCustomer;
