import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postProductOrderCart } from '../../../Services/axios/productOrder';

const useAddProductCart = ({ invalidateQueries = [], onAddProductSuccess, onAddProductError }) => {
  const queryClient = useQueryClient();

  const {
    data: responseData,
    mutate: addProductCart,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload) => postProductOrderCart(payload),
    onSuccess: (data, variables, context) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      onAddProductSuccess?.(data, variables, context);
    },
    onError: (err) => onAddProductError?.(err),
  });

  return {
    responseData,
    addProductCart,
    isLoading,
    isError,
    error,
  };
};

export default useAddProductCart;
