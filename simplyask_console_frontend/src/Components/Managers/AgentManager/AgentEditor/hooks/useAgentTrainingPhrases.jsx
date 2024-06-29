import { useMutation } from '@tanstack/react-query';

import { submitAndGetTrainingPhrases } from '../../../../../Services/axios/agentAxios';

const useAgentTrainingPhrases = ({ onSuccess, onError }) => {
  const { mutate: submitIntentTrainingPhrases, isLoading: isSubmitIntentTrainingPhrasesLoading } = useMutation({
    mutationFn: async (payload) => {
      const { params, body } = payload;
      return submitAndGetTrainingPhrases(params, body);
    },
    onSuccess,
    onError,
  });
  return {
    submitIntentTrainingPhrases,
    isSubmitIntentTrainingPhrasesLoading,
  };
};

export default useAgentTrainingPhrases;
