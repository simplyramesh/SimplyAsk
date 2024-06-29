import { useQuery } from '@tanstack/react-query';

import { getWebhookTriggerById } from '../../../Services/axios/webhook';

export const GET_EVENT_TRIGGER_BY_ID_QUERY_KEY = 'GET_EVENT_TRIGGER_BY_ID';

export const useGetWebhookTriggerById = ({ id, options }) => {
  const { data: webhookTrigger, isLoading: isWebhookTriggerLoading } = useQuery({
    queryKey: [GET_EVENT_TRIGGER_BY_ID_QUERY_KEY, id],
    queryFn: () => getWebhookTriggerById(id),
    ...options,
  });

  return {
    webhookTrigger,
    isWebhookTriggerLoading,
  };
};
