import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createWebhookTrigger } from '../../../Services/axios/webhook';
import { EVENT_TRIGGER_QUERY_KEYS } from '../utils/constants';

import { GET_EVENT_TRIGGER_BY_ID_QUERY_KEY } from './useGetWebhookTriggerById';

const useCreateWebhookTrigger = ({ onError, onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createNewWebhookTrigger, isPending: isWebhookCreating } = useMutation({
    mutationFn: (body) => createWebhookTrigger(body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [EVENT_TRIGGER_QUERY_KEYS.GET_EVENT_TRIGGERS] });
      queryClient.invalidateQueries({ queryKey: [GET_EVENT_TRIGGER_BY_ID_QUERY_KEY] });
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    createWebhookTrigger: createNewWebhookTrigger,
    isWebhookCreating,
  };
};

export default useCreateWebhookTrigger;
