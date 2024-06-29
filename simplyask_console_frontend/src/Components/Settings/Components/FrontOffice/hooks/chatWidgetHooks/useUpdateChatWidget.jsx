import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChatWidgetById } from '../../../../../../Services/axios/widgetAxios';
import { WIDGETS_QUERY_KEYS } from '../../constants/common';

const useUpdateChatWidget = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: updateChatWidgetMutation, isPending: isUpdateChatWidgetLoading } = useMutation({
    mutationFn: (payload) => updateChatWidgetById(payload),
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

  return { updateChatWidgetMutation, isUpdateChatWidgetLoading };
};

export default useUpdateChatWidget;
