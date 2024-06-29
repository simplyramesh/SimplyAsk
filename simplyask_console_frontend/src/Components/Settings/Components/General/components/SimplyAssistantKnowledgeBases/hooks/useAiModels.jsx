import { useQuery } from '@tanstack/react-query';
import { getAiModels } from '../../../../../../../Services/axios/knowledgeBaseAxios';

export const AI_MODELS_QUERY_KEY = 'AI_MODELS_QUERY_KEY';

const useAiModels = () => {
  const { data: aiModels, isFetching } = useQuery({
    queryKey: [AI_MODELS_QUERY_KEY],
    queryFn: getAiModels,
  });
  return { aiModels, isFetching };
};

export default useAiModels;
