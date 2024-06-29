import { useRecoilState } from 'recoil';
import { agentEditorStepId, agentEditorStepsCopyBuffer } from '../store';
import { useAbstractUpdateSteps } from '../../../shared/hooks/useAbstractUpdateSteps';

export const useUpdateSteps = () => {
  const [lastStepId, setLastStepId] = useRecoilState(agentEditorStepId);
  const [copyBuffer, setCopyBuffer] = useRecoilState(agentEditorStepsCopyBuffer);

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
    updateEdges,
    getEdges
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
    updateEdges,
    getEdges
  };
};

