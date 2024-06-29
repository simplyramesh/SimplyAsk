import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { getGenerativeAgentDetails } from '../../../../Services/axios/agentManager';
import {
  generativeEditorInitialState,
  generativeEditorState,
  initialGenerativeAgentState,
} from '../GenerativeEditor/store';

export const GENERATIVE_AGENT_DETAILS = 'GENERATIVE_AGENT_DETAILS';

const useGenerativeAgentDetails = (id, rest = {}) => {
  const setGenerativeAgent = useSetRecoilState(generativeEditorState);
  const setGenerativeAgentInitialState = useSetRecoilState(generativeEditorInitialState);

  const { data: generativeAgentDetails, isFetching: isGenerativeAgentLoading } = useQuery({
    queryKey: [GENERATIVE_AGENT_DETAILS, id],
    queryFn: () =>
      getGenerativeAgentDetails(id).then((data) => {
        const { objectives, topics, modelConfig, greeting, greetingEnabled } = data || {};

        const objectivesWithActions = objectives.map((objective) => ({
          ...objective,
          actions: objective.actions.map((action) => ({
            ...action,
            data: action.data ? JSON.parse(action.data) : null,
          })),
        }));

        if (objectives?.length > 0) {
          const payload = {
            greeting,
            greetingEnabled,
            objectives: objectivesWithActions,
            topics,
            modelConfig,
          };

          setGenerativeAgent((prev) => ({
            ...prev,
            ...payload,
          }));

          setGenerativeAgentInitialState((prev) => ({
            ...prev,
            ...payload,
          }));
        }

        return data;
      }),
    enabled: !!id,
    ...rest,
  });

  useEffect(() => {
    return () => {
      setGenerativeAgent(initialGenerativeAgentState);
      setGenerativeAgentInitialState(initialGenerativeAgentState);
    };
  }, []);

  return {
    generativeAgentDetails,
    isGenerativeAgentLoading,
  };
};

export default useGenerativeAgentDetails;
