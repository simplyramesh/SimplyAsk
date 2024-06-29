import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAgentDefaultConfig } from '../../../../../../Services/axios/agentAxios';

const useSaveDefaultAgentConfig = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const { mutate: saveAgentDefaultSetting } = useMutation({
    mutationFn: (payload) => updateAgentDefaultConfig(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getDefaultAgentConfig'] });

      onSuccess?.(data);
    },
  });
  return { saveAgentDefaultSetting };
};

export default useSaveDefaultAgentConfig;
