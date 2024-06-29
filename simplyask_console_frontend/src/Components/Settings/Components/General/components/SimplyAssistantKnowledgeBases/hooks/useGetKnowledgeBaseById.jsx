import { useQuery } from '@tanstack/react-query';
import { getKnowledgeBaseById } from '../../../../../../../Services/axios/knowledgeBaseAxios';
import { KNOWLEDGE_BASE_QUERY_KEYS } from '../utils/constants';

const useGetKnowledgeBaseById = ({ knowledgeBaseId, enabled }) => {
  const { data: knowledgeBase, isPending: isLoading } = useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE_BY_ID, knowledgeBaseId],
    queryFn: () => getKnowledgeBaseById(knowledgeBaseId),
    enabled,
  });
  return { knowledgeBase, isLoading };
};

export default useGetKnowledgeBaseById;
