import { PROCESS_STATUSES } from '../../ProcessHistory/constants/core';
import { DATA_TYPES } from '../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/utils/constants/common';
import { defaultStepIds, SQUARE_STEPS_STATUS_CONFIG, STATIC_DYNAMIC_PARAM_TYPES, stepTypes } from '../constants/graph';
import { DIAGRAM_ID } from '../constants/layout';
import { removeConditionalNode, removeGroupNode, removeNode } from '../services/graph';
const findIdOfStatusStep = (workflow, key) =>
  workflow?.nodes?.find((node) => node.attributes?.[key])?.key || DIAGRAM_ID;

export const findDefaultZoomNodeIdForEmbeddedSideModal = (sideModalData, workflow) => {
  if (!sideModalData || !workflow) return DIAGRAM_ID;

  const { status } = sideModalData;

  switch (true) {
    case status === PROCESS_STATUSES.PREPARING:
      return defaultStepIds.START;
    case status === PROCESS_STATUSES.RESOLVED || status === PROCESS_STATUSES.SUCCESS:
      return defaultStepIds.END;
    case status === PROCESS_STATUSES.CANCELLED:
      return findIdOfStatusStep(workflow, SQUARE_STEPS_STATUS_CONFIG.IS_CANCELLED);
    case status === PROCESS_STATUSES.EXECUTING:
      return findIdOfStatusStep(workflow, SQUARE_STEPS_STATUS_CONFIG.IS_CURRENTLY_EXECUTING);
    case status === PROCESS_STATUSES.FAILED:
      return findIdOfStatusStep(workflow, SQUARE_STEPS_STATUS_CONFIG.HAS_EXECUTION_ERROR);
    default:
      return DIAGRAM_ID;
  }
};

export const getActionKey = (stepSettings, { when, includes, then, otherwise }) => {
  let key;

  if (when) {
    const whenValue = stepSettings.find((setting) => setting.stepSettingTemplate.promptText === when)?.currentValue;

    if (includes.includes(whenValue)) {
      key = then;
    } else {
      key = otherwise;
    }
  }

  return key;
};

export const getParamStaticDynamicText = (paramValue, paramType) => {
  try {
    const children = JSON.parse(paramValue || null)?.root?.children[0].children;

    return children?.some((el) => el.type === 'param')
      ? STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC
      : STATIC_DYNAMIC_PARAM_TYPES.STATIC;
  } catch {
    return paramType;
  }
};

export const handleRemoveStep = ({ graph, stepId, editingStep, set, state }) => {
  if ([stepTypes.LOOP_START, stepTypes.RPA_START].includes(graph.getNodeAttribute(stepId, 'stepType'))) {
    removeGroupNode(graph, stepId);
  } else {
    removeNode(graph, stepId);
  }

  const isDeletedStepOpened = editingStep?.stepId === stepId;

  set({ ...state, editingStep: isDeletedStepOpened ? null : editingStep, workflow: graph.export() });
};

export const handleRemoveConditionalStep = ({ graph, stepId, state, set }) => {
  removeConditionalNode(graph, stepId);

  set({ ...state, workflow: graph.export() });
};

export const formattedWorkflowFileUpload = ({ id, name }) => ({
  type: DATA_TYPES.FILE,
  id,
  name,
});
