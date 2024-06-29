import { useQuery } from '@tanstack/react-query';
import { useReactFlow } from 'reactflow';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../../config/routes';
import { getAgentDetails } from '../../../../../Services/axios/agentManager';
import { modifiedCurrentPageDetails } from '../../../../../store';
import { AGENT_QUERY_KEYS } from '../../constants/core';
import { agentEditorState, initialAgentEditorStateAfterLoad } from '../store';
import { useEffect } from 'react';

const useAgentDetails = (id) => {
  const { setViewport } = useReactFlow();
  const setAgent = useSetRecoilState(agentEditorState);
  const setInitialAgentStateAfterLoad = useSetRecoilState(initialAgentEditorStateAfterLoad);
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const {
    data: agent,
    isSuccess,
    isLoading: isAgentLoading,
  } = useQuery({
    queryKey: [AGENT_QUERY_KEYS.GET_AGENT_DETAILS, id],
    queryFn: () => getAgentDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (isSuccess && agent) {
      const data = agent;

      const parsedAgent = {
        ...data,
        steps: data.nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            stepItems: node.data.stepItems.map((stepItem) => ({
              ...stepItem,
              data: JSON.parse(stepItem.data),
            })),
          },
        })),
      };

      if (parsedAgent.viewport) {
        setViewport(parsedAgent.viewport);
      }

      const agentDetails = {
        edges: parsedAgent.edges,
        settings: parsedAgent.settings,
        agentConfiguration: parsedAgent.agentConfiguration,
        assignedWidgets: parsedAgent.assignedWidgets?.map(({ widgetId }) => ({ widgetId })),
        assignedPhoneNumbers: parsedAgent.assignedPhoneNumbers?.map(({ telephoneNumberId }) => ({ telephoneNumberId })),
        version: parsedAgent.version || 0,
        lastStepId: parsedAgent.lastStepId || 0,
      };

      setAgent((prev) => ({
        ...prev,
        ...agentDetails,
        ...(parsedAgent.steps.length > 0 && { steps: parsedAgent.steps }),
      }));

      setInitialAgentStateAfterLoad((prev) => ({
        ...prev,
        ...agentDetails,
        steps: parsedAgent.steps,
      }));

      const isNewlyCreatedAgent = !data?.edges?.length && !data?.nodes?.length;

      isNewlyCreatedAgent
        ? setCurrentPageDetailsState({
            pageUrlPath: routes.AGENT_MANAGER_DIAGRAM,
            breadCrumbLabel: 'New Agent',
          })
        : setCurrentPageDetailsState({
            pageUrlPath: routes.AGENT_MANAGER_DIAGRAM,
            breadCrumbLabel: `#${id}`,
          });
    }
  }, [isSuccess, agent]);

  return {
    agent,
    isAgentLoading,
  };
};

export default useAgentDetails;
