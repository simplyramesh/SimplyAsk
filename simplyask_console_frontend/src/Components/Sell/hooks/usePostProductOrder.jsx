import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postProductOrder } from '../../../Services/axios/productOrder';

const usePostProductOrder = ({ invalidateQueries = [], onPlaceProductOrderSuccess, onPlaceProductOrderError }) => {
  const queryClient = useQueryClient();

  const {
    data: responseData,
    mutate: placeProductOrder,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload) => postProductOrder(payload),
    onSuccess: (data, variables, context) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      onPlaceProductOrderSuccess?.(data, variables, context);
    },
    onError: (err) => onPlaceProductOrderError?.(err),
  });

  return {
    responseData,
    placeProductOrder,
    isLoading,
    isError,
    error,
  };
};

export default usePostProductOrder;
