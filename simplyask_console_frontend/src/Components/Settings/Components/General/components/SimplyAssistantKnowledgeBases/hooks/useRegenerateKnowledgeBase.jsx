import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateKnowledgeBase } from '../../../../../../../Services/axios/knowledgeBaseAxios';
import { KNOWLEDGE_BASE_QUERY_KEYS } from '../utils/constants';

export const useRegenerateKnowledgeBase = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    const { mutate: regenerateKnowledgeBaseTask, isPending: isRegenerateKnowledgeBaseTaskLoading } = useMutation({
        mutationFn: async (id) => regenerateKnowledgeBase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE] });
            onSuccess?.();
        },
        onError: () => {
            onError?.();
        },
    });

    return {
        regenerateKnowledgeBaseTask,
        isRegenerateKnowledgeBaseTaskLoading,
    };
};
