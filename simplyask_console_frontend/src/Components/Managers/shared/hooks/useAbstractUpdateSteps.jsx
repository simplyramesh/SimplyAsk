import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

import { generateUUID } from '../../../Settings/AccessManagement/utils/helpers';
import { setIn } from '../../../shared/REDISIGNED/utils/helpers';
import { STEP_ENTITY_TYPE } from '../../AgentManager/AgentEditor/constants/steps';
import { updateAllSteps, updateStepById } from '../utils/updateService';

export const useAbstractUpdateSteps = ({
  lastStepId,
  setLastStepId,
  copyBuffer,
  setCopyBuffer,
}) => {
  const reactFlowInstance = useReactFlow();

  // for debugging purposes
  window.reactFlowInstance = reactFlowInstance;

  const centralizeStep = useCallback(({
    x, y, width, height,
  }) => {
    reactFlowInstance.setCenter(x + width / 2, y + (height / 2), { zoom: 1, duration: 300 });
  }, [reactFlowInstance]);

  const updateStep = useCallback((id, fields) => reactFlowInstance.setNodes((steps) => updateStepById(id, steps, fields)), [reactFlowInstance]);

  const updateSteps = useCallback((fields) => reactFlowInstance.setNodes((steps) => updateAllSteps(steps, fields)), [reactFlowInstance]);

  const addStep = useCallback((step) => reactFlowInstance.setNodes((nodes) => nodes.concat(step)), [reactFlowInstance]);

  const deleteSteps = useCallback((steps) => reactFlowInstance.deleteElements({ nodes: steps }), [reactFlowInstance]);

  const deleteEdges = useCallback((edges) => reactFlowInstance.deleteElements({ edges }), [reactFlowInstance]);

  const getStepById = useCallback((id) => reactFlowInstance.getNode(id), [reactFlowInstance]);

  const updateEdges = useCallback((edges) => reactFlowInstance.setEdges(edges), [reactFlowInstance]);

  const getEdges = useCallback(() => reactFlowInstance.getEdges(), [reactFlowInstance]);

  const copyStep = useCallback((id) => {
    const step = getStepById(id);

    setCopyBuffer({
      type: STEP_ENTITY_TYPE.STEP,
      data: step,
    });
  });

  const pasteStep = useCallback((targetId, pastePosition, {
    hoveredPath = 'meta.hovered',
    titlePath = 'label',
  } = {}) => {
    if (!copyBuffer.data || copyBuffer.type !== STEP_ENTITY_TYPE.STEP) {
      return;
    }

    const copyStep = copyBuffer.data;
    const newId = lastStepId + 1;
    let position;

    if (targetId) {
      const targetStep = getStepById(targetId);

      position = {
        x: targetStep.position.x + targetStep.width + 50,
        y: targetStep.position.y,
      };
    } else {
      position = { ...pastePosition };
    }

    updateSteps((step) => ({ ...step, selected: false, data: setIn(step.data, hoveredPath, false) }));

    addStep({
      ...copyStep, position, id: newId.toString(), selected: true, data: setIn(copyStep.data, titlePath, `${copyStep.data[titlePath]} - Copy`),
    });

    centralizeStep({ ...position, width: copyStep.width, height: copyStep.height });

    setLastStepId(newId);
  }, [lastStepId, centralizeStep, addStep]);

  const duplicateStep = useCallback((id, {
    hoveredPath = 'meta.hovered',
    titlePath = 'label',
  } = {}) => {
    const step = getStepById(id);

    const newId = lastStepId + 1;

    const position = {
      x: step.position.x + step.width + 50,
      y: step.position.y,
    };

    const withUpdatedStepItemsIds = (data) => ({
      ...data,
      ...(!!step.data.stepItems && {
        stepItems: data.stepItems.map((stepItem) => ({
          ...stepItem,
          id: generateUUID(),
        })),
      }),
    });

    updateSteps((step) => ({ ...step, selected: false, data: setIn(step.data, hoveredPath, false) }));

    addStep({
      ...step, position, id: newId.toString(), selected: true, data: setIn(withUpdatedStepItemsIds(step.data), titlePath, `${step.data[titlePath]} - Copy`),
    });

    centralizeStep({ ...position, width: step.width, height: step.height });

    setLastStepId(newId);
  }, [addStep, updateSteps, lastStepId, getStepById]);

  const centralizeAndSelectStep = useCallback((id) => {
    const { width, height, position } = getStepById(id);

    centralizeStep({ ...position, width, height });

    updateSteps((step) => ({
      selected: step.id === id,
    }));
  }, [getStepById, updateSteps, reactFlowInstance, centralizeStep]);

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
