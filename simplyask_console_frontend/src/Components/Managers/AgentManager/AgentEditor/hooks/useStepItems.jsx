import { useMemo } from 'react';
import { groupBy } from 'lodash';
import { STEP_ITEM_ICONS } from '../constants/stepDelegates';
import { STEP_ITEM_TYPES } from '../constants/steps';
import { TRANSITION_TYPE } from '../constants/common';
import { CONDITION_RULE_TYPE, CONDITION_OPERAND } from '../constants/common';
import useAgentActions from './useAgentActions';

const concatenateAndRemove = (inputObj, key1, key2) => {
  if (!inputObj.hasOwnProperty(key1) || !inputObj.hasOwnProperty(key2)) {
    return inputObj;
  }

  inputObj[key1] = inputObj[key1].concat(inputObj[key2]);
  delete inputObj[key2];

  return inputObj;
};

export const useStepItems = ({ stepItems }) => {
  const { agentActions } = useAgentActions();

  const grouped = useMemo(() => groupBy(stepItems, 'type'), [stepItems]);

  [
    { key1: STEP_ITEM_TYPES.ACTION, key2: STEP_ITEM_TYPES.ACTION_ERROR },
    { key1: STEP_ITEM_TYPES.SPEAK, key2: STEP_ITEM_TYPES.QUICK_REPLIES },
  ].forEach(({ key1, key2 }) => concatenateAndRemove(grouped, key1, key2));

  const unifiedStepItems = useMemo(
    () =>
      Object.keys(grouped).reduce((acc, key) => {
        acc[key] = grouped[key]
          .map((item) => {
            const { id, type, data } = item;

            if (type === STEP_ITEM_TYPES.PARAMETER) {
              return [
                {
                  id,
                  item,
                  value: data.parameterName,
                  type: STEP_ITEM_TYPES.PARAMETER,
                  placeholder: 'Enter Parameter...',
                  Icon: STEP_ITEM_ICONS[key],
                  errors: data.errors,
                },
              ];
            } else if (type === STEP_ITEM_TYPES.SPEAK) {
              const [first, ...rest] = data.message;

              return [
                {
                  id,
                  item,
                  value: first.value,
                  type: STEP_ITEM_TYPES.SPEAK,
                  placeholder: 'Enter message...',
                  Icon: STEP_ITEM_ICONS[key],
                  hiddenMessages: rest.length,
                  errors: data.errors,
                },
              ];
            } else if (type === STEP_ITEM_TYPES.QUICK_REPLIES) {
              return [
                {
                  id,
                  item,
                  value: data.quickReplies,
                  type: STEP_ITEM_TYPES.QUICK_REPLIES,
                  Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.QUICK_REPLIES],
                  errors: data.errors,
                },
              ];
            } else if (type === STEP_ITEM_TYPES.ACTION) {
              const value = agentActions?.find(({ displayName }) => displayName === data.actionType)?.displayName;

              return [
                {
                  id,
                  item,
                  value,
                  type: STEP_ITEM_TYPES.ACTION,
                  placeholder: 'Select Action',
                  Icon: STEP_ITEM_ICONS[key],
                  errors: data.errors,
                },
              ];
            } else if (type === STEP_ITEM_TYPES.ACTION_ERROR) {
              return [
                {
                  id,
                  item,
                  type: STEP_ITEM_TYPES.ACTION_ERROR,
                  placeholder: 'On Action Error',
                  Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.ACTION_ERROR],
                  errors: data.errors,
                },
              ];
            } else if (type === STEP_ITEM_TYPES.INQUIRY) {
              return [
                {
                  id,
                  item,
                  type: STEP_ITEM_TYPES.INQUIRY,
                  value: data.responseParam,
                  placeholder: 'Set Inquiry',
                  Icon: STEP_ITEM_ICONS[key],
                  errors: data.errors,
                },
              ];
            } else if (type === STEP_ITEM_TYPES.TRANSITION) {
              if (data.type === TRANSITION_TYPE.INTENT || data.type === TRANSITION_TYPE.INTENT_CONDITION) {
                return [
                  {
                    id,
                    item,
                    value: data.intent.name,
                    type: STEP_ITEM_TYPES.TRANSITION,
                    placeholder: 'Select Transition',
                    Icon: STEP_ITEM_ICONS[key],
                    errors: data.errors,
                  },
                ];
              } else if (
                data.type === TRANSITION_TYPE.CONDITION &&
                (data.ruleType === CONDITION_RULE_TYPE.MATCH_ONE || data.ruleType === CONDITION_RULE_TYPE.MATCH_ALL)
              ) {
                const { parameter, operand, value } =
                  data.conditions.find((el) => {
                    const conditionName = `${el.parameter.name}${CONDITION_OPERAND[el.operand]}${el.value}`;
                    return conditionName.length;
                  }) ?? data.conditions[0];

                const conditionLength = data.conditions.reduce((acc, el) => {
                  const conditionName = `${el.parameter.name}${el.value}`;
                  if (conditionName) {
                    acc++;
                  }
                  return acc;
                }, 0);
                return [
                  {
                    id,
                    item,
                    value: parameter.name + CONDITION_OPERAND[operand] + value,
                    type: STEP_ITEM_TYPES.TRANSITION,
                    placeholder: 'Select Transition',
                    Icon: STEP_ITEM_ICONS[key],
                    conditionLength: conditionLength - 1,
                    errors: data.errors,
                  },
                ];
              } else {
                return [
                  {
                    id,
                    item,
                    value: data.customCondition,
                    type: STEP_ITEM_TYPES.TRANSITION,
                    placeholder: 'Select Transition',
                    Icon: STEP_ITEM_ICONS[key],
                    errors: data.errors,
                  },
                ];
              }
            } else if (data.type === STEP_ITEM_TYPES.SWITCH) {
              return [
                {
                  id,
                  item,
                  value: data.type,
                  type: STEP_ITEM_TYPES.SWITCH,
                  Icon: STEP_ITEM_ICONS[key],
                  errors: data.errors,
                },
              ];
            } else {
              return item;
            }
          })
          .flat();

        return acc;
      }, {}),
    [grouped]
  );

  return {
    unifiedStepItems,
  };
};
