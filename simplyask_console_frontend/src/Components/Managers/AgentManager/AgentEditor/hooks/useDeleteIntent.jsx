import { useMutation } from '@tanstack/react-query';
import { deleteIntent } from '../../../../../Services/axios/agentAxios';
import { useQueryClient } from '@tanstack/react-query';
import { GET_AGENT_INTENTS_BY_FILTER } from './useAgentIntentsByFilter';

const useDeleteIntent = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteIntentApi, isLoading: isDeleteIntentApiLoading } = useMutation({
    mutationFn: async (payload) => deleteIntent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_AGENT_INTENTS_BY_FILTER] });
      onSuccess?.();
    },
    onError,
  });
  return {
    deleteIntentApi,
    isDeleteIntentApiLoading,
  };
};

export default useDeleteIntent;
