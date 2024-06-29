import { useRecoilState } from 'recoil';
import { useAbstractUpdateSteps } from '../../../shared/hooks/useAbstractUpdateSteps';
import { orchestratorStepId, orchestratorStepsCopyBuffer } from '../store';

export const useUpdateSteps = () => {
  const [lastStepId, setLastStepId] = useRecoilState(orchestratorStepId);
  const [copyBuffer, setCopyBuffer] = useRecoilState(orchestratorStepsCopyBuffer);

  const {
    updateStep,
    updateSteps,
    addStep,
    deleteSteps,
    deleteEdges,
    getStepById,
    duplicateStep,
    copyStep,
    pasteStep,
    centralizeStep,
    centralizeAndSelectStep,
  } = useAbstractUpdateSteps({
    lastStepId,
    setLastStepId,
    copyBuffer,
    setCopyBuffer,
  });

  return {
    updateStep,
    updateSteps,
    addStep,
    deleteSteps,
    deleteEdges,
    getStepById,
    duplicateStep,
    copyStep,
    pasteStep,
    centralizeStep,
    centralizeAndSelectStep,
  };
};
