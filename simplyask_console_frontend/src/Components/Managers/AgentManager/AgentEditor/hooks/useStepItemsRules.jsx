import { useEffect, useMemo } from 'react';
import { STEP_ITEM_TYPES } from '../constants/steps';
import { useUpdateSteps } from './useUpdateSteps';
import { setIn } from '../../../../shared/REDISIGNED/utils/helpers';
import { useUpdateNodeInternals } from 'reactflow';
import { getStepItemTemplate } from '../utils/defaultTemplates';

export const useStepItemsRules = (stepId, stepItems) => {
  const { updateStep, deleteSteps, getEdges, updateEdges } = useUpdateSteps();
  const updateNodeInternals = useUpdateNodeInternals();
  const actionStepItems = useMemo(() => stepItems.filter((item) => item.type === STEP_ITEM_TYPES.ACTION), [stepItems]);
  const actionErrorItem = useMemo(
    () => stepItems.find((item) => item.type === STEP_ITEM_TYPES.ACTION_ERROR),
    [stepItems]
  );
  const actionStepItemsCount = actionStepItems.length;

  const speakStepItems = useMemo(() => stepItems.filter((item) => item.type === STEP_ITEM_TYPES.SPEAK), [stepItems]);
  const quickRepliesItem = useMemo(
    () => stepItems.find((item) => item.type === STEP_ITEM_TYPES.QUICK_REPLIES),
    [stepItems]
  );
  const speakStepItemsCount = speakStepItems.length;

  useEffect(() => {
    if (actionStepItemsCount > 0 && !actionErrorItem) {
      updateStep(stepId, (prev) =>
        setIn(prev, 'data.stepItems', prev.data.stepItems.concat(getStepItemTemplate(STEP_ITEM_TYPES.ACTION_ERROR)))
      );
      updateNodeInternals(stepId);
    } else if (actionErrorItem && actionStepItemsCount === 0) {
      updateStep(stepId, (prev) =>
        setIn(
          prev,
          'data.stepItems',
          prev.data.stepItems.filter((item) => item.id !== actionErrorItem?.id)
        )
      );
      const edges = getEdges();
      updateEdges(edges.filter((edge) => !(actionErrorItem?.id === edge.sourceHandle)))
      updateNodeInternals(stepId);
    }

    if (speakStepItemsCount > 0 && !quickRepliesItem) {
      updateStep(stepId, (prev) =>
        setIn(prev, 'data.stepItems', prev.data.stepItems.concat(getStepItemTemplate(STEP_ITEM_TYPES.QUICK_REPLIES)))
      );
      updateNodeInternals(stepId);
    } else if (quickRepliesItem && speakStepItemsCount === 0) {
      updateStep(stepId, (prev) =>
        setIn(
          prev,
          'data.stepItems',
          prev.data.stepItems.filter((item) => item.id !== quickRepliesItem?.id)
        )
      );
      updateNodeInternals(stepId);
    }

    if (stepItems.length === 0) {
      deleteSteps([{ id: stepId }]);
    }
  }, [stepId, actionStepItemsCount, actionErrorItem, speakStepItemsCount, quickRepliesItem, stepItems.length]);

  return null;
};
