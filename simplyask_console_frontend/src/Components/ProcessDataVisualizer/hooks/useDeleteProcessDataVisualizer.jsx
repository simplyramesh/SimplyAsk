import { useMutation } from '@tanstack/react-query';

import { deleteProcessDataVisualization } from '../../../Services/axios/processDataVisualizer';

export const useDeleteProcessDataVisualizer = ({ onSuccess, onError } = {}) => {
  const { mutate: deleteProcessDataVisualizer, isLoading: isDeleteProcessVisualizationLoading } = useMutation({
    mutationFn: (id) => deleteProcessDataVisualization(id),
    onSuccess,
    onError,
  });

  return {
    deleteProcessDataVisualizer,
    isDeleteProcessVisualizationLoading,
  };
};
