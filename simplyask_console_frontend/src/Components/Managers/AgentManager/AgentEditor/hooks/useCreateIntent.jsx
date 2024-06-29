import { useMutation } from '@tanstack/react-query';
import { createNewIntent } from '../../../../../Services/axios/agentAxios';
import { useQueryClient } from '@tanstack/react-query';
import { GET_AGENT_INTENTS_BY_FILTER } from './useAgentIntentsByFilter';

const useCreateIntent = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: createNewIntentApi, isLoading: isCreateNewIntentApiLoading } = useMutation({
    mutationFn: async (payload) => createNewIntent(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GET_AGENT_INTENTS_BY_FILTER] });
      onSuccess?.(data);
    },
    onError,
  });
  return {
    createNewIntentApi,
    isCreateNewIntentApiLoading,
  };
};

export default useCreateIntent;
