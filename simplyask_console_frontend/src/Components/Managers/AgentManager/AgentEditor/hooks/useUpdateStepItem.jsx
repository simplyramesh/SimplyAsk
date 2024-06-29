import { useRecoilState, useRecoilValue } from 'recoil';
import { agentEditorStepId, agentEditorStepItem, agentEditorStepsCopyBuffer } from '../store';
import { useCallback } from 'react';
import { setIn } from '../../../../shared/REDISIGNED/utils/helpers';
import { variantTemplate } from '../utils/defaultTemplates';
import { generateUUID } from '../../../../Settings/AccessManagement/utils/helpers';
import { CONNECTOR_STEP_ITEM_TYPES, STEP_ENTITY_TYPE } from '../constants/steps';
import { STEP_DRAG_HANDLE_CLASS, STEP_TYPES } from '../../../shared/constants/steps';
import { useUpdateSteps } from './useUpdateSteps';

export const useUpdateStepItem = () => {
  const { addStep, updateStep, getStepById, centralizeStep, updateEdges, getEdges } = useUpdateSteps();
  const [copyBuffer, setCopyBuffer] = useRecoilState(agentEditorStepsCopyBuffer);
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const [lastStepId, setLastStepId] = useRecoilState(agentEditorStepId);

  // TODO: If a similar function already exists, replace this with it
  const getNestedProperty = (obj, pathArr) => pathArr.reduce((acc, key) => acc[key], obj);

  const getStepItem = useCallback((stepId, stepItemId) => {
    const step = getStepById(stepId);

    return step.data.stepItems.find((item) => item.id === stepItemId);
  }, []);
  // NOTE: getStepItemIndex may seem redundant as index would be available when iterating,
  // the ability to delete items may cause an inaccurate index, better to use the id, which does not presently change
  const getStepItemIndex = useCallback((stepId, stepItemId) => {
    const step = getStepById(stepId);
    const stepItemIndex = step.data.stepItems.findIndex((item) => item.id === stepItemId);

    return { stepItemIndex };
  }, []);

  const getStepItemIndexedPath = useCallback((stepId, stepItemId, pathSegments = []) => {
    const { stepItemIndex } = getStepItemIndex(stepId, stepItemId);

    const basePath = `data.stepItems[${stepItemIndex}]`;
    const fullPathWithSegments = pathSegments.reduce((path, segment) => `${path}.${segment}`, basePath);

    return {
      basePath,
      fullPathWithSegments,
    };
  }, []);

  const addDataToStepItem = useCallback(
    (stepId, pathSegments = []) => {
      updateStep(stepId, (prev) => {
        const modifiedStepItems = prev.data.stepItems.map((item) => {
          return setIn(item, pathSegments.join('.'), [
            ...getNestedProperty(item, pathSegments),
            variantTemplate(generateUUID()),
          ]);
        });
        return setIn(prev, 'data.stepItems', modifiedStepItems);
      });
    },
    [stepItemOpened]
  );

  const updateDataInStepItem = useCallback((stepId, stepItemId, newValue) => {
    updateStep(stepId, (prev) => {
      return setIn(prev, 'data.stepItems', newValue);
    });
  }, []);

  const duplicateStepItem = useCallback((stepId, dataItem, type) => {
    updateStep(stepId, (prev) => {
      const itemToDuplicate = prev.data.stepItems.find((item) => item.type === type && item.id === dataItem.id);

      return setIn(prev, 'data.stepItems', prev.data.stepItems.concat(setIn(itemToDuplicate, 'id', generateUUID())));
    });
  }, []);

  const deleteStepItem = useCallback((stepId, dataItemId, type) => {
    updateStep(stepId, (prev) =>
      setIn(
        prev,
        'data.stepItems',
        prev.data.stepItems.filter((item) => !(item.type === type && item.id === dataItemId))
      )
    );

    const edges = getEdges();
    CONNECTOR_STEP_ITEM_TYPES.includes(type)
      ? updateEdges(edges.filter((edge) => !(dataItemId === edge.sourceHandle)))
      : null;
  }, []);

  const copyStepItem = useCallback((stepId, stepItem, type) => {
    const stepItemModel = getStepItem(stepId, stepItem.id, type);

    setCopyBuffer({
      data: stepItemModel,
      type: STEP_ENTITY_TYPE.BLOCK,
    });
  }, []);

  const pasteStepItem = useCallback((targetId, position) => {
    const copyBufferData = copyBuffer.data;

    if (!copyBufferData) {
      return;
    }

    if (targetId) {
      updateStep(targetId, (prev) =>
        setIn(prev, 'data.stepItems', prev.data.stepItems.concat(setIn(copyBuffer.data, 'id', generateUUID())))
      );
    } else {
      const newNodeId = lastStepId + 1;
      const pasteData = setIn(copyBufferData, 'id', generateUUID());
      const newNode = {
        id: newNodeId.toString(),
        type: STEP_TYPES.DEFAULT,
        dragHandle: `.${STEP_DRAG_HANDLE_CLASS}`,
        data: {
          label: `Step ${newNodeId}`,
          stepItems: [pasteData],
          meta: {
            hovered: false,
            touched: false,
          },
        },
        position,
      };

      setLastStepId(newNodeId);
      addStep(newNode);
    }
  }, []);

  const moveOutStepItem = useCallback(
    (stepId, stepItemId) => {
      const newStepId = lastStepId + 1;
      const step = getStepById(stepId);
      const stepItem = step.data.stepItems.find((item) => item.id === stepItemId);

      if (stepItem) {
        const position = {
          x: step.position.x + step.width + 50,
          y: step.position.y,
        };

        const newStep = {
          id: newStepId.toString(),
          type: STEP_TYPES.DEFAULT,
          dragHandle: `.${STEP_DRAG_HANDLE_CLASS}`,
          data: {
            label: `Step ${newStepId}`,
            stepItems: [stepItem],
            meta: {
              hovered: false,
              touched: false,
            },
          },
          position,
        };

        updateStep(stepId, (prev) =>
          setIn(
            prev,
            'data.stepItems',
            prev.data.stepItems.filter((item) => stepItemId !== item.id)
          )
        );

        centralizeStep({ ...position, width: step.width, height: step.height });

        setLastStepId(newStepId);
        addStep(newStep);
      }
    },
    [lastStepId]
  );

  const removeDataFromStepItem = useCallback((stepId, stepItemId, itemIndex, pathSegments = []) => {
    const { stepItemIndex } = getStepItemIndex(stepId, stepItemId);

    if (stepItemIndex !== -1) {
      updateStep(stepId, (prev) => {
        const { fullPathWithSegments } = getStepItemIndexedPath(prev.id, stepItemId, pathSegments);
        const itemsArray = getNestedProperty(prev, ['data', 'stepItems', stepItemIndex, ...pathSegments]);

        const updatedItems = itemsArray.filter((_, index) => index !== itemIndex);

        return setIn(prev, fullPathWithSegments, updatedItems);
      });
    }
  }, []);

  return {
    addDataToStepItem,
    duplicateStepItem,
    deleteStepItem,
    copyStepItem,
    pasteStepItem,
    updateDataInStepItem,
    removeDataFromStepItem,
    moveOutStepItem,
  };
};
