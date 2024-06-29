import { useMutation } from '@tanstack/react-query';

import { generateProcessDataVisualization } from '../../../Services/axios/processDataVisualizer';

export const useGenerateProcessDataVisualizer = ({ onSuccess, onError } = {}) => {
  const { mutate: generateProcessVisualization, isLoading: isGenerateProcessVisualizationLoading } = useMutation({
    mutationFn: (payload) => generateProcessDataVisualization(payload),
    onSuccess,
    onError,
  });

  return {
    generateProcessVisualization,
    isGenerateProcessVisualizationLoading,
  };
};
