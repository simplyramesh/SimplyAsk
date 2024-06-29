import { useCallback } from 'react';
import { setIn } from '../../../shared/REDISIGNED/utils/helpers';
import { useUpdateSteps } from '../../OrchestrationManager/ProcessOrchestratorEditor/hooks/useUpdateSteps';
import { useStepHover } from './useStepHover';

export const useSharedEditorHandlers = () => {
  const { onMouseEnter, onMouseLeave } = useStepHover();
  const { updateSteps } = useUpdateSteps();

  const onConnectStart = useCallback((_, params) => updateSteps((prev) => {
    return setIn(prev, 'data.meta.touched', params);
  }), []);

  const onConnectEnd = useCallback(() => updateSteps((prev) => {
    return setIn(prev, 'data.meta.touched', null);
  }), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeMouseEnter = useCallback((event, node) => onMouseEnter(node.id), []);

  const onNodeMouseLeave = useCallback((event, node) => onMouseLeave(node.id), []);

  return {
    onConnectStart,
    onConnectEnd,
    onDragOver,
    onNodeMouseEnter,
    onNodeMouseLeave,
  }
}
