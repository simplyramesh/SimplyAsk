import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createKnowledgeBase } from '../../../../../../../Services/axios/knowledgeBaseAxios';
import { KNOWLEDGE_BASE_QUERY_KEYS } from '../utils/constants';

export const useCreateKnowledgeBase = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createKnowledgeBaseTask, isPending: isCreateKnowledgeBaseTaskLoading } = useMutation({
    mutationFn: async (data) => createKnowledgeBase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    createKnowledgeBaseTask,
    isCreateKnowledgeBaseTaskLoading,
  };
};
