import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postPsfSettings } from '../../../../../../Services/axios/processManager';

const useSavePsfSettings = ({ onError, onSuccess, invalidateQueries = [] } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: savePsfSettings, isLoading: isSavePsfSettingsLoading } = useMutation({
    mutationFn: ({ workflowId, payload }) => postPsfSettings(workflowId, payload),
    onSuccess: (data, variables) => {
      const queriesToInvalidate = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];

      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    savePsfSettings,
    isSavePsfSettingsLoading,
  };
};

export default useSavePsfSettings;
