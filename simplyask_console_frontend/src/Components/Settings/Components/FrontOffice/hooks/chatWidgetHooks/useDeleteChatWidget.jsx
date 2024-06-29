import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteChatWidgetById } from '../../../../../../Services/axios/widgetAxios';
import { WIDGETS_QUERY_KEYS } from '../../constants/common';

const useDeleteChatWidget = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteChatWidget, isLoading: isDeleteChatWidgetLoading } = useMutation({
    mutationFn: async (payload) => {
      const { id, params } = payload;
      return deleteChatWidgetById(id, params);
    },
    onSuccess: ({ data, variables }) => {
      queryClient.invalidateQueries({ queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_ALL] });
      queryClient.invalidateQueries({ queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_FILTERED] });
      onSuccess?.({
        data,
        variables,
      });
    },
    onError: (error) => {
      onError?.(error);
    },
  });
  return {
    deleteChatWidget,
    isDeleteChatWidgetLoading,
  };
};
export default useDeleteChatWidget;
