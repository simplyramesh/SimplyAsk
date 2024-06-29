import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateKnowledgeBase } from '../../../../../../../Services/axios/knowledgeBaseAxios';
import { KNOWLEDGE_BASE_QUERY_KEYS } from '../utils/constants';

export const useUpdateKnowledgeBase = ({ onSuccess, onError, knowledgeBaseId } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: updateKnowledgeBaseTask, isPending: isUpdateKnowledgeBaseTaskLoading } = useMutation({
    mutationFn: async (data) => updateKnowledgeBase(data, knowledgeBaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE] });
      queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE_BY_ID] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });

  return {
    updateKnowledgeBaseTask,
    isUpdateKnowledgeBaseTaskLoading,
  };
};
