import { useQuery } from '@tanstack/react-query';
import { getAgentDefaultConfig } from '../../../../../../Services/axios/agentAxios';
import { useEffect } from 'react';

const useGetDefaultAgentConfig = ({ onSuccess }) => {
  const {
    isSuccess,
    data: agentConfig,
    isFetching,
  } = useQuery({
    queryKey: ['getAgentDefaultConfig'],
    queryFn: getAgentDefaultConfig,
  });

  useEffect(() => {
    if (isSuccess && agentConfig) {
      onSuccess(agentConfig);
    }
  }, [isSuccess, agentConfig]);

  return { agentConfig, isFetching };
};

export default useGetDefaultAgentConfig;
