import { useEffect, useState } from 'react';

import { setIn } from '../../../../shared/REDISIGNED/utils/helpers';
import { STEP_TYPES } from '../../../shared/constants/steps';
import { getErrors } from '../../../shared/utils/validation';
import { TRANSITION_TYPE } from '../constants/common';
import { KNOWLEDGE_SOURCE_TYPES, STEP_ITEM_TYPES, SWITCH_TYPES } from '../constants/steps';
import { validationSchemasMap } from '../utils/validation';

import { useUpdateSteps } from './useUpdateSteps';

export const useStepItemValidation = (data, type) => {
  const { updateSteps } = useUpdateSteps();

  const [totalRequiredFields, setTotalRequiredFields] = useState(0);

  useEffect(() => {
    const validatedData = (data, type) => {
      switch (type) {
      case STEP_ITEM_TYPES.PARAMETER:
        setTotalRequiredFields(2);
        break;
      case STEP_ITEM_TYPES.INQUIRY:
        setTotalRequiredFields(3);
        break;
      case STEP_ITEM_TYPES.ACTION:
        if ([KNOWLEDGE_SOURCE_TYPES.AI_MODEL].includes(data.knowledgeSource)) {
          setTotalRequiredFields(3);
        } else {
          setTotalRequiredFields(4);
        }
        break;
      case STEP_ITEM_TYPES.ACTION_ERROR:
        setTotalRequiredFields(1);
        break;
      case STEP_ITEM_TYPES.SPEAK:
        setTotalRequiredFields(1);
        break;
      case STEP_ITEM_TYPES.TRANSITION:
        if ([TRANSITION_TYPE.INTENT, TRANSITION_TYPE.CONDITION].includes(data.type)) {
          setTotalRequiredFields(1);
        } else {
          setTotalRequiredFields(2);
        }
        break;
      case STEP_ITEM_TYPES.SWITCH:
        if (data.switchType === SWITCH_TYPES.AGENT) {
          setTotalRequiredFields(1);
        }
        break;
      default:
        setTotalRequiredFields(0);
      }
    };

    validatedData(data, type);
  }, [data, type]);

  useEffect(() => () => {
    updateSteps((prev) => {
      if (prev?.type === STEP_TYPES.SWITCH) {
        const errors = getErrors({
          schema: validationSchemasMap[prev.type],
          data: prev.data,
        });
        return setIn(prev, 'data', { ...prev.data, errors });
      }

      return setIn(prev, 'data.stepItems', prev.data.stepItems?.map((item) => {
        const errors = getErrors({
          schema: validationSchemasMap[item.type],
          data: item.data,
        });

        return {
          ...item,
          data: {
            ...item.data,
            errors,
          },
        };
      }));
    });
  }, []);

  return { totalRequiredFields };
};
