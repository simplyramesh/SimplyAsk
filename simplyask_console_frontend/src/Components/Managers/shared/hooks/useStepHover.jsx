import { useUpdateSteps } from '../../AgentManager/AgentEditor/hooks/useUpdateSteps';
import { setIn } from '../../../shared/REDISIGNED/utils/helpers';
import { useCallback } from 'react';

export const useStepHover = () => {
  const { updateStep } = useUpdateSteps();

  const handleHover = useCallback((stepId, hovered) => {
    updateStep(stepId, (prevStep) => setIn(prevStep, 'data.meta.hovered', hovered));
  }, []);

  return {
    onMouseEnter: (stepId) => handleHover(stepId, true),
    onMouseLeave: (stepId) => handleHover(stepId, false)
  };
};
