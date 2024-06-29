import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_FILTERED_TEST_DATA } from './useGetFilteredTestData';

const useCreateTestEntity = ({ mutationFn, invalidateQueries = [], onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: createTestEntityMutation, ...rest } = useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      queryClient.invalidateQueries({ queryKey: [GET_FILTERED_TEST_DATA] });

      await onSuccess?.(data, variables);
    },
    onError: async (err) => {
      await onError?.(err);
    },
  });

  return {
    createTestEntity: createTestEntityMutation,
    ...rest,
  };
};

export default useCreateTestEntity;
