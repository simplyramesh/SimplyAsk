import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { agentEditorStepItem } from '../store';
import { useUpdateSteps } from './useUpdateSteps';

export const useCompetitiveStateUpdate = ({ nodes }) => {
  const { updateSteps } = useUpdateSteps();
  const [stepItemOpened, setStepItemOpened] = useRecoilState(agentEditorStepItem);

  const someNodesSelected = useMemo(() => nodes.some((node) => node.selected), [nodes]);

  useEffect(() => {
    if (stepItemOpened) {
      // deselect all steps when any stepItem selected
      updateSteps(prev => ({ ...prev, selected: false }));
    }
  }, [stepItemOpened]);

  useEffect(() => {
    if (someNodesSelected) {
      setStepItemOpened(null);
    }
  }, [someNodesSelected]);
}
