import { array, boolean, number, object, string } from 'yup';

import { oneOf } from 'prop-types';
import { CONDITION_RULE_TYPE, TRANSITION_TYPE } from '../constants/common';
import { KNOWLEDGE_SOURCE_TYPES, SWITCH_TYPES } from '../constants/steps';

export const ACTION_VALIDATION_TYPES = {
  PROMPT_SIMPLYASSISTANT: 'PROMPT_SIMPLYASSISTANT',
  PROCESS_ASYNC: 'PROCESS_ASYNC',
  PROCESS_SYNC: 'PROCESS_SYNC',
};

export const intentCreateEditValidationSchema = object().shape({
  name: string().nullable().required('A Name for your intent is required'),
  trainingPhrases: array()
    .of(object())
    .test(
      'trainingPhrases',
      'At least 1 training phrase is required',
      (val) => !(val?.map((phrase) => phrase.value).join('')?.length < 1)
    ),
});

export const parameterSchema = object({
  parameterType: string().required('parameter type is required'),
  parameterName: string().required('parameter name is required'),
  parameterValue: string().required('parameter value is required'),
});

export const inquirySchema = object({
  question: array()
    .of(
      object().shape({
        id: string(),
        value: string(),
      })
    )
    .required()
    .test('test-questions', 'Fill all questions', (value) => value.every((item) => Boolean(item.value))),
  responseParam: string().required('Param is required'),
  responseType: string().required('Type is required'),
});

export const speakSchema = object({
  message: array()
    .of(
      object().shape({
        id: string(),
        value: string(),
      })
    )
    .required()
    .test('test-messages', 'Fill all messages', (value) => value.every((item) => Boolean(item.value))),
});

export const actionSchema = object({
  actionType: string().required(),
  ignoreErrors: boolean(),
  validationType: string(),

  // if actionType is process
  processId: string().when('validationType', {
    is: (value) => value === ACTION_VALIDATION_TYPES.PROMPT_SIMPLYASSISTANT,
    then: string(),
    otherwise: string().required(),
  }),
  params: array().when('validationType', {
    is: (value) => value === ACTION_VALIDATION_TYPES.PROMPT_SIMPLYASSISTANT,
    then: array(),
    otherwise: array().when('processId', {
      is: (value) => !!value,
      then: array().test('test-params', 'Params are required', (params) =>
        params.filter((param) => param.fieldCriteria === 'M').every((param) => !!param.value?.toString())
      ),
      otherwise: array(),
    }),
  }),
  outputParamMapping: array(),

  // if actionType is prompt Symphona
  knowledgeSource: string(),
  knowledgeBase: string().when('knowledgeSource', {
    is: (value) => [KNOWLEDGE_SOURCE_TYPES.CUSTOM, KNOWLEDGE_SOURCE_TYPES.AUGMENTED].includes(value),
    then: string().required(),
    otherwise: string(),
  }),
  prompt: string().when('validationType', {
    is: (value) => value === ACTION_VALIDATION_TYPES.PROMPT_SIMPLYASSISTANT,
    then: string().required(),
    otherwise: string(),
  }),
  outputParameterResponse: string().when('validationType', {
    is: (value) => value === ACTION_VALIDATION_TYPES.PROMPT_SIMPLYASSISTANT,
    then: string().required(),
    otherwise: string(),
  }),
  outputParameterSource: string().when('validationType', {
    is: (value) => value === ACTION_VALIDATION_TYPES.PROMPT_SIMPLYASSISTANT,
    then: string().required(),
    otherwise: string(),
  }),
  context: string(),
  maxIncludedMessages: number(),
  persona: string(),
  maxResponseLength: number(),
  responseVariability: number(),
  validateBeforeSending: boolean(),
  includeReferences: boolean(),
  translateOutput: boolean(),
  model: oneOf([string(), number()]),
});

export const switchSchema = object({
  switchType: string().required(),
  switchAgentId: string().when('switchType', {
    is: (value) => value === SWITCH_TYPES.AGENT,
    then: string().required(),
    otherwise: string(),
  }),
});

export const transitionSchema = object({
  type: string(),
  ruleType: string(),

  intent: object().when('type', {
    is: (value) => [TRANSITION_TYPE.INTENT, TRANSITION_TYPE.INTENT_CONDITION].includes(value),
    then: object().shape({
      intentId: string(),
      intentType: string(),
      name: string(),
    }).required(),
  }),

  customCondition: string().when('ruleType', {
    is: (value) => CONDITION_RULE_TYPE.CUSTOM === value,
    then: string().required(),
    otherwise: string(),
  }),

  conditions: array().when('type', {
    is: (value) => [TRANSITION_TYPE.CONDITION, TRANSITION_TYPE.INTENT_CONDITION].includes(value),
    then: array().of(object().shape({
      operand: string(),
      parameter: object().shape({
        name: string(),
        parameterId: string(),
        type: string(),
      }),
      value: string(),
    })).test('test-array-every', (arr) => arr.every((v) => Boolean(v.operand && v.parameter.name && v.value))),
    otherwise: array().of(object().shape({
      operand: string(),
      parameter: object().shape({
        name: string(),
        parameterId: string(),
        type: string(),
      }),
      value: string(),
    })),
  }),

  fulfillmentPhrase: array().of(
    object().shape({
      id: string(),
      value: string(),
    }),
  ),
});
