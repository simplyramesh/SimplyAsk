import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postProductOrderCheckout } from '../../../Services/axios/productOrder';

const useProductCheckout = ({ invalidateQueries = [], onCheckoutSuccess, onCheckoutError }) => {
  const queryClient = useQueryClient();

  const {
    data: responseData,
    mutate: checkout,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload) => postProductOrderCheckout(payload),
    onSuccess: (data, variables, context) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      onCheckoutSuccess?.(data, variables, context);
    },
    onError: (err) => onCheckoutError?.(err),
  });

  return {
    responseData,
    checkout,
    isLoading,
    isError,
    error,
  };
};

export default useProductCheckout;
