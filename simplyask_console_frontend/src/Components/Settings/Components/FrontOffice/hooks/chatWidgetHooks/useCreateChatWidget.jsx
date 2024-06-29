import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createChatWidget } from '../../../../../../Services/axios/widgetAxios';
import { WIDGETS_QUERY_KEYS } from '../../constants/common';

const useCreateChatWidget = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: createChatWidgetMutation, isLoading: isCreateChatWidgetLoading } = useMutation({
    mutationFn: async (payload) => createChatWidget(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_ALL],
      });

      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return { createChatWidgetMutation, isCreateChatWidgetLoading };
};

export default useCreateChatWidget;
