import { partition } from 'lodash';
import { useCallback } from 'react';
import { setIn } from '../../../../shared/REDISIGNED/utils/helpers';
import { useUpdateSteps } from './useUpdateSteps';
import { useRecoilValue } from 'recoil';
import { agentEditorStepsUpdate } from '../store';
import { useUpdateNodeInternals } from 'reactflow';
import { useUpdateStepItem } from './useUpdateStepItem';

export const useStepItemsReorder = () => {
  const updateNodeInternals = useUpdateNodeInternals();
  const nodes = useRecoilValue(agentEditorStepsUpdate);
  const { updateStep, updateSteps } = useUpdateSteps();
  const { moveOutStepItem } = useUpdateStepItem();

  const reorder = (type, stepItems, startIndex, endIndex) => {
    let [matched, rest] = partition(stepItems, (item) => item.type === type);

    const result = Array.from(matched);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return [...result, ...rest];
  };

  const move = (type, sourceItems, destinationItems, droppableSource, droppableDestination) => {
    const [matchedSource, restSource] = partition(sourceItems, (item) => item.type === type);
    const [matchedDestination, restDestination] = partition(destinationItems, (item) => item.type === type);

    const sourceClone = Array.from(matchedSource);
    const destClone = Array.from(matchedDestination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = [...sourceClone, ...restSource];
    result[droppableDestination.droppableId] = [...destClone, ...restDestination];

    return result;
  };

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, type } = result;

      const sourceStepId = source.droppableId;
      const [extractedSourceId] = source.droppableId.split('-');

      if (destination) {
        const targetStepId = destination?.droppableId;
        const [extractedTargetId] = destination?.droppableId.split('-');

        const sourceStepItems = nodes.find((node) => {
          return node.id === extractedSourceId;
        })?.data.stepItems;
        const destinationStepItems = nodes.find((node) => {
          return node.id === extractedTargetId;
        })?.data.stepItems;

        if (!destination) {
          return;
        }

        // reordering step items in scope of one step
        if (sourceStepId === targetStepId) {
          updateStep(extractedSourceId, (prev) =>
            setIn(prev, 'data.stepItems', reorder(type, prev.data.stepItems, source.index, destination.index))
          );
          updateNodeInternals(extractedSourceId);
        } else {
          // moving step item from one step to another
          const result = move(type, sourceStepItems, destinationStepItems, source, destination);

          updateSteps((prev) => {
            if (extractedSourceId === prev.id) {
              return setIn(prev, 'data.stepItems', result[sourceStepId]);
            } else if (extractedTargetId === prev.id) {
              return setIn(prev, 'data.stepItems', result[targetStepId]);
            }

            return prev;
          });
        }

        updateNodeInternals(extractedSourceId);
        updateNodeInternals(extractedTargetId);
      } else {
        moveOutStepItem(extractedSourceId, result.draggableId);
      }
    },
    [nodes, updateNodeInternals]
  );

  return onDragEnd;
};
