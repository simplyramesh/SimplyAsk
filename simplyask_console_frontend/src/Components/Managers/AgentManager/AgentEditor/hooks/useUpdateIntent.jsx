import { useMutation } from '@tanstack/react-query';
import { updateIntent } from '../../../../../Services/axios/agentAxios';
import { useQueryClient } from '@tanstack/react-query';
import { GET_AGENT_INTENTS_BY_FILTER } from './useAgentIntentsByFilter';

const useUpdateIntent = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: updateIntentApi, isLoading: isUpdateIntentApiLoading } = useMutation({
    mutationFn: async (payload) => updateIntent(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GET_AGENT_INTENTS_BY_FILTER] });
      onSuccess?.(data);
    },
    onError,
  });
  return {
    updateIntentApi,
    isUpdateIntentApiLoading,
  };
};

export default useUpdateIntent;
