import * as Yup from 'yup';

import { DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA } from '../../Managers/shared/utils/validation';
import { VALIDATION_TYPES, VALIDATION_TYPES_REGEX } from '../../PublicFormPage/constants/validationTypes';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import {
  REST_BODY_CODE_TYPES,
  REST_BODY_TYPES,
  REST_BODY_TYPES_LABELS,
  STEP_INPUT_TYPE_KEYS,
  THEN_OTHERWISE_ACTION_TYPES,
} from '../components/sideMenu/SideMenu/keyConstants';
import { getActionKey } from './helperFunctions';
import { isValidHTML, isValidJSON, isValidJavaScript, isValidXML } from '../../../utils/helperFunctions';

export const ERROR_TYPES = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
};

export const INTEGER_REGEX = /^(0|[1-9][0-9]*)$/;

const isStringFieldValid = (param) => {
  const defaultValidation = { isValid: false, errorMessage: null };

  const { currentValue, stepSettingTemplate } = param;
  const { validationArray } = stepSettingTemplate?.stepSettingOptions;

  // Check if the currentValue is valid
  if (currentValue === EXPRESSION_BUILDER_DEFAULT_VALUE) {
    return defaultValidation;
  }

  const validate = (validationObject) => {
    const { type, min, max, errorMessage } = validationObject;

    switch (type) {
      case VALIDATION_TYPES.RANGE:
        const integerValue = parseInt(currentValue, 10);
        return {
          isValid: INTEGER_REGEX.test(currentValue) && integerValue >= min && integerValue <= max,
          errorMessage,
        };
      case VALIDATION_TYPES.MAX_INPUT_SIZE:
        try {
          const parsedValue = JSON.parse(currentValue);
          const valueArray = parsedValue.root.children[0].children;
          const totalCharacters = valueArray.reduce((accumulator, valueObject) => {
            return accumulator + valueObject.text.length;
          }, 0);
          return { isValid: totalCharacters <= max, errorMessage };
        } catch {
          return { isValid: currentValue.length <= max, errorMessage };
        }
      case VALIDATION_TYPES.GENERIC:
        try {
          const parsedValue = JSON.parse(currentValue);
          const valueArray = parsedValue.root.children[0].children;

          const text = valueArray.reduce((accumulator, valueObject) => {
            return accumulator + valueObject.text;
          }, '');

          return {
            isValid: VALIDATION_TYPES_REGEX[VALIDATION_TYPES.GENERIC].test(text),
            errorMessage,
          };
        } catch {
          return { isValid: false, errorMessage };
        }
      // Can add other validations based on the types....
      default:
        return defaultValidation;
    }
  };

  // If validationArray exists and has length
  if (validationArray && validationArray.length) {
    for (let index = 0; index < validationArray.length; index++) {
      return validate(validationArray[index]);
    }
  }

  if (currentValue.length === 0) {
    return defaultValidation;
  } else {
    return { isValid: true, errorMessage: null };
  }
};

export const getIsCodeValueValidValidator = (type) => {
  switch (type) {
    case REST_BODY_TYPES.JSON:
      return isValidJSON;
    case REST_BODY_TYPES.XML:
      return isValidXML;
    case REST_BODY_TYPES.HTML:
      return isValidHTML;
    case REST_BODY_TYPES.JAVASCRIPT:
      return isValidJavaScript;
    default:
      return () => true;
  }
};

export const isValueValid = (param, allParams) => {
  const value = param.currentValue;
  const errorMessage = null;
  const { stepSettingTemplate } = param;
  const { stepSettingsInputType, stepSettingOptions } = stepSettingTemplate;
  const { isHideField, when, includes, then, otherwise, dependentSettingTemplateId } = stepSettingOptions || {};

  const key = getActionKey(allParams, {
    when,
    includes,
    then,
    otherwise,
  });

  if (dependentSettingTemplateId) {
    const dependentParam = allParams.find(
      (param) => param.stepSettingTemplate.stepSettingTemplateId === dependentSettingTemplateId
    );

    if (dependentParam) {
      const dependentValue = dependentParam.currentValue;

      if (stepSettingsInputType === STEP_INPUT_TYPE_KEYS.REST_BODY_PARAMETER_LIST) {
        const valueType = dependentValue?.value;

        if (valueType && REST_BODY_CODE_TYPES.includes(valueType)) {
          const validator = getIsCodeValueValidValidator(valueType);
          const isCodeValid = validator(value);

          return {
            isValid: !value || isCodeValid,
            errorMessage: isCodeValid ? null : `Value is invalid ${REST_BODY_TYPES_LABELS[valueType]} code`,
            isCustomValidation: true,
          };
        }
      }
    }
  }

  if (isHideField || key === THEN_OTHERWISE_ACTION_TYPES.HIDDEN) {
    return { isValid: true, errorMessage: null };
  }

  if (Array.isArray(value)) {
    return { isValid: value?.length, errorMessage };
  }

  if (value && value instanceof Object) {
    return { isValid: Object.keys(value).length > 0, errorMessage };
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return isStringFieldValid(param);
  }

  return { isValid: true, errorMessage: null };
};

export const getValidatedParams = (values, paramsName) =>
  values[paramsName]?.reduce((acc, setting, index) => {
    const { isOptional, isRecommended, displayName } = setting.stepSettingTemplate;

    const { isValid, isCustomValidation, errorMessage } = isValueValid(setting, values[paramsName]);

    if (!isOptional && !isValid) {
      acc[index] = {
        type: ERROR_TYPES.ERROR,
        message: errorMessage ?? `A valid ${displayName} is Required`,
      };
    }

    if (isRecommended && !isOptional && !isValid) {
      acc[index] = {
        type: ERROR_TYPES.WARNING,
        message: 'recommended',
      };
    }

    if (!values.displayName) {
      acc.displayName = {
        type: ERROR_TYPES.ERROR,
        message: 'Field is Required',
      };
    }

    if (isCustomValidation && !isValid) {
      acc[index] = {
        type: ERROR_TYPES.ERROR,
        message: errorMessage,
      };
    }

    return acc;
  }, {});

export const processEditorGeneralSettingsValidationSchema = () =>
  Yup.object().shape({
    displayName: Yup.string()
      .required('A Process name is required')
      .max(DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.NAME_MAX_LEN, 'Up to 52 characters allowed')
      .test('is-first-char-alpha', 'The first character must be an alphabet letter', (value) =>
        VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ALPHABET].test(value?.[0])
      ),
    falloutDestination: Yup.array().of(Yup.object()).min(1, 'Fallout destination is Required'),
  });
