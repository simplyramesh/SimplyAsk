import { generateUUID } from '../../../../Settings/AccessManagement/utils/helpers';
import { getExpressionBuilderValueWithStr } from '../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { STEP_DRAG_HANDLE_CLASS, STEP_TYPES } from '../../../shared/constants/steps';
import { INTENT_TYPE, paramTypeOptions } from '../constants/common';
import { KNOWLEDGE_SOURCE_TYPES, STEP_ITEM_TYPES, SWITCH_INPUT_KEYS } from '../constants/steps';

import { ACTION_VALIDATION_TYPES } from './validationSchemas';

export const variantTemplate = (id) => ({
  id,
  value: '',
  isGeneratedVariant: false,
});

export const parameterTemplate = () => ({
  parameterType: paramTypeOptions[0].value,
  parameterName: '',
  parameterValue: '',
});

export const actionTemplate = () => ({
  actionType: '',
  ignoreErrors: false,
  processId: '',
  params: [],
  outputParamMapping: [],
  knowledgeSource: KNOWLEDGE_SOURCE_TYPES.AI_MODEL,
  knowledgeBase: '',
  prompt: '',
  outputParameterResponse: 'response',
  outputParameterSource: 'references',
  context: '',
  maxIncludedMessages: 20,
  persona: '',
  maxResponseLength: 128,
  responseVariability: 0.7,
  validateBeforeSending: false,
  includeReferences: false,
  translateOutput: false,
  model: '',
  validationType: ACTION_VALIDATION_TYPES.PROMPT_SIMPLYASSISTANT,
});

export const speakTemplate = () => ({
  message: [variantTemplate(generateUUID())],
});

export const quickRepliesTemplate = () => ({
  quickReplies: [],
});

export const actionErrorTemplate = (id) => ({
  errorMessages: [variantTemplate(id)],
  stepIdToTransfer: '',
});

export const inquiryTemplate = (id) => ({
  question: [variantTemplate(id)],
  responseParam: '',
  responseType: '',
});

export const transitionConditionsTemplate = (id) => ({
  parameter: {
    parameterId: id,
    name: '',
    type: '',
  },
  operand: 'EQUALS',
  value: '',
});

export const transitionTemplate = (id) => ({
  type: 'INTENT',
  intent: {
    intentId: generateUUID(),
    name: '',
    trainingPhrases: [variantTemplate(generateUUID())],
    intentType: INTENT_TYPE.LOCAL,
  },
  conditions: [transitionConditionsTemplate(generateUUID())],
  customCondition: '',
  ruleType: 'MATCH_ONE',
  fulfillmentPhrase: [variantTemplate(id)],
});

export const switchTemplate = () => ({
  type: '',
});

export const intentsParameterTemplate = (color) => ({
  bgColor: color.BG_COLOR,
  borderColor: color.BORDER_COLOR,
  paramName: '',
  paramType: '',
  id: generateUUID(),
});

export const formattedAutoGenPhrases = (data, isIntentPhrase = false) => data?.map((msg) => ({
  ...variantTemplate(generateUUID()),
  value: isIntentPhrase ? getExpressionBuilderValueWithStr(msg) : msg,
  isGeneratedVariant: true,
}));

export const getStepItemTemplate = (type) => {
  switch (type) {
  case STEP_ITEM_TYPES.PARAMETER:
    return {
      id: generateUUID(),
      type,
      order: 0,
      data: parameterTemplate(),
    };
  case STEP_ITEM_TYPES.SPEAK:
    return {
      id: generateUUID(),
      type,
      order: 1,
      data: speakTemplate(generateUUID()),
    };
  case STEP_ITEM_TYPES.QUICK_REPLIES:
    return {
      id: generateUUID(),
      type,
      order: 1,
      data: quickRepliesTemplate(),
    };
  case STEP_ITEM_TYPES.ACTION:
    return {
      id: generateUUID(),
      type,
      order: 2,
      data: actionTemplate(),
    };
  case STEP_ITEM_TYPES.ACTION_ERROR:
    return {
      id: generateUUID(),
      type,
      order: 2,
      data: actionErrorTemplate(generateUUID()),
    };
  case STEP_ITEM_TYPES.INQUIRY:
    return {
      id: generateUUID(),
      type,
      order: 3,
      data: inquiryTemplate(generateUUID()),
    };
  case STEP_ITEM_TYPES.TRANSITION:
    return {
      id: generateUUID(),
      type,
      order: 4,
      data: transitionTemplate(generateUUID()),
    };
  case STEP_ITEM_TYPES.SWITCH:
    return {
      id: generateUUID(),
      type,
      order: 5,
      data: switchTemplate(),
    };
  default:
    return null;
  }
};

export const getNewlyAddedStep = ({ id, stepDelegate, position }) => {
  if (stepDelegate.type === STEP_TYPES.SWITCH) {
    return {
      id,
      type: STEP_TYPES.SWITCH,
      data: {
        label: stepDelegate.name,
        [SWITCH_INPUT_KEYS.SWITCH_TYPE]: stepDelegate.switchType,
        meta: {
          hovered: false,
          touched: false,
        },
      },
      position,
    };
  }

  return {
    id,
    type: STEP_TYPES.DEFAULT,
    dragHandle: `.${STEP_DRAG_HANDLE_CLASS}`,
    data: {
      label: `Step ${id}`,
      stepItems: [getStepItemTemplate(stepDelegate.type)],
      meta: {
        hovered: false,
        touched: false,
      },
    },
    position,
  };
};
