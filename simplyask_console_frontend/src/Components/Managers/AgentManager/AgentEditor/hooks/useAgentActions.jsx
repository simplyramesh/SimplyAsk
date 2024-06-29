import { useQuery } from '@tanstack/react-query';
import { getAgentActions } from '../../../../../Services/axios/agentManager';
import { AGENT_QUERY_KEYS } from '../../constants/core';

const useAgentActions = () => {
  const { data: agentActions, isLoading: isAgentActionsLoading } = useQuery({
    queryKey: [AGENT_QUERY_KEYS.GET_AGENT_ACTIONS],
    queryFn: () => getAgentActions(),
  });

  return {
    agentActions,
    isAgentActionsLoading,
  };
};

export default useAgentActions;
