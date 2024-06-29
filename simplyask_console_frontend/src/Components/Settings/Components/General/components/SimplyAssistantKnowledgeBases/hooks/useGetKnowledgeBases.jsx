import { useQuery } from '@tanstack/react-query';
import { getKnowledgeBase } from '../../../../../../../Services/axios/knowledgeBaseAxios';
import { KNOWLEDGE_BASE_QUERY_KEYS } from '../utils/constants';

const useGetKnowledgeBases = ({ enabled } = {}) => {
  const { data: knowledgeBases, isFetching } = useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE],
    queryFn: () => getKnowledgeBase(),
    refetchInterval: enabled ? 60000 : undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { knowledgeBases, isFetching };
};

export default useGetKnowledgeBases;
