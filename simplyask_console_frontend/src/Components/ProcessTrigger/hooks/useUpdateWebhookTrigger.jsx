import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWebhookTrigger } from '../../../Services/axios/webhook';
import { GET_EVENT_TRIGGER_BY_ID_QUERY_KEY } from './useGetWebhookTriggerById';
import { EVENT_TRIGGER_QUERY_KEYS } from '../utils/constants';

const useUpdateWebhookTrigger = ({ onError, onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateWebhookTriggerFn, isLoading: isWebhookUpdating } = useMutation({
    mutationFn: ({ id, payload }) => updateWebhookTrigger(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [EVENT_TRIGGER_QUERY_KEYS.GET_EVENT_TRIGGERS] });
      queryClient.invalidateQueries({ queryKey: [GET_EVENT_TRIGGER_BY_ID_QUERY_KEY] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    updateWebhookTrigger: updateWebhookTriggerFn,
    isWebhookUpdating,
  };
};

export default useUpdateWebhookTrigger;
