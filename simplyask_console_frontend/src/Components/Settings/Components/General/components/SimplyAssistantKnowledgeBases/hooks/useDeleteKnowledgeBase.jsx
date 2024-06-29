import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteKnowledgeBaseById } from '../../../../../../../Services/axios/knowledgeBaseAxios';
import { KNOWLEDGE_BASE_QUERY_KEYS } from '../utils/constants';

export const useDeleteKnowledgeBase = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteKnowledgeBase, isPending: isDeleteKnowledgeBaseLoading } = useMutation({
    mutationFn: async (id) => deleteKnowledgeBaseById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE] });

      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
  return {
    deleteKnowledgeBase,
    isDeleteKnowledgeBaseLoading,
  };
};
