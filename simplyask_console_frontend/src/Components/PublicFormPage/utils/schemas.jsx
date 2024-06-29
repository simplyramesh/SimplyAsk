import { format } from 'date-fns';
import * as Yup from 'yup';

import {
  VALIDATION_TYPES,
  VALIDATION_TYPES_ERROR_MESSAGES,
  VALIDATION_TYPES_REGEX,
} from '../constants/validationTypes';

export const getYupValidationByType = (type, name, isRequired = false) => {
  const schema = (baseSchema, errorMessage) =>
    isRequired ? baseSchema.required(errorMessage || `${name} is required`) : baseSchema;

  switch (type) {
    case VALIDATION_TYPES.GENERIC:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.GENERIC],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.GENERIC]
        )
      );
    case VALIDATION_TYPES.ALPHA_NUMERIC:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ALPHA_NUMERIC],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.ALPHA_NUMERIC]
        )
      );
    case VALIDATION_TYPES.ALPHABET:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ALPHABET],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.ALPHABET]
        )
      );
    case VALIDATION_TYPES.ADDRESS:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ADDRESS],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.ADDRESS]
        )
      );
    case VALIDATION_TYPES.NUMBER:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.NUMBER],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.NUMBER]
        )
      );
    case VALIDATION_TYPES.FLOAT_NUMBER:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.FLOAT_NUMBER],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.FLOAT_NUMBER]
        )
      );
    case VALIDATION_TYPES.BOOLEAN:
      return schema(
        Yup.string()
          .matches(
            VALIDATION_TYPES_REGEX[VALIDATION_TYPES.BOOLEAN],
            VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.BOOLEAN]
          )
          .transform((value) => {
            if (value.toLowerCase() === 'true') return 'true';
            if (value.toLowerCase() === 'false') return 'false';
            return value;
          })
      );
    case VALIDATION_TYPES.EMAIL:
      return schema(Yup.string().email(VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.EMAIL]));
    case VALIDATION_TYPES.PHONE_NUMBER:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.PHONE_NUMBER],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.PHONE_NUMBER]
        )
      );
    case VALIDATION_TYPES.DATE_OF_BIRTH:
      return schema(
        Yup.mixed()
          .transform((value, originalValue) =>
            originalValue instanceof Date ? format(originalValue, 'yyyy-MM-dd') : originalValue
          )
          .typeError(VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.DATE_OF_BIRTH])
          .test('isValidDateFormat', VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.DATE_OF_BIRTH], (value) =>
            !value ? true : VALIDATION_TYPES_REGEX[VALIDATION_TYPES.DATE_OF_BIRTH].test(value)
          )
      );
    case VALIDATION_TYPES.POSTAL_CODE:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.POSTAL_CODE],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.POSTAL_CODE]
        )
      );
    case VALIDATION_TYPES.FILE:
      return schema(Yup.mixed());
    case VALIDATION_TYPES.OBJECT:
      return schema(
        Yup.string().test(
          'isValidJsonObject',
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.OBJECT],
          (value) => {
            if (!value) return true;

            try {
              const parsed = JSON.parse(value);
              return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
            } catch (error) {
              return false;
            }
          }
        )
      );
    case VALIDATION_TYPES.SIGNATURE:
      return schema(
        Yup.string().matches(
          VALIDATION_TYPES_REGEX[VALIDATION_TYPES.SIGNATURE],
          VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.SIGNATURE]
        ),
        VALIDATION_TYPES_ERROR_MESSAGES(name)[VALIDATION_TYPES.SIGNATURE]
      );
    default:
      return schema(Yup.mixed());
  }
};

export const passwordValidationSchema = Yup.object().shape({
  password: Yup.string(),
  confirmedPassword: Yup.string().nullable(),
});
