import * as Yup from 'yup';
import {
  VALIDATION_TYPES,
  VALIDATION_TYPES_ERROR_MESSAGES,
  VALIDATION_TYPES_REGEX,
} from '../../../../PublicFormPage/constants/validationTypes';

export const onlyNumberDashRegex = /^[\d-]+$/;

export const onlyNumberRegex = /^\d+$/;

export const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const YUP_HEX_COLOR_VALIDATION_MSG = 'Enter a valid Hex color value, ex - #2D3A47';

export const validateDataTypes = () =>
  Yup.string()
    .trim()
    .test('typeValidation', 'invalid type', (value, context) => {
      const { type } = context.parent;

      if (!type || type === VALIDATION_TYPES.ANYTHING || !value) return true;

      switch (type) {
        case VALIDATION_TYPES.NUMBER:
        case VALIDATION_TYPES.ZIP_CODE:
        case VALIDATION_TYPES.POSTAL_CODE:
        case VALIDATION_TYPES.ALPHABET:
        case VALIDATION_TYPES.ALPHA_NUMERIC:
        case VALIDATION_TYPES.PHONE_NUMBER:
        case VALIDATION_TYPES.EMAIL:
          return (
            VALIDATION_TYPES_REGEX[type].test(value) ||
            new Yup.ValidationError(VALIDATION_TYPES_ERROR_MESSAGES('Default Value')[type], null, 'defaultValue')
          );
        case VALIDATION_TYPES.JSON:
          try {
            JSON.parse(value);
            return true;
          } catch (e) {
            throw new Yup.ValidationError(VALIDATION_TYPES_ERROR_MESSAGES('Default Value')[type], null, 'defaultValue');
          }
        default:
          return true;
      }
    })
    .optional();

export const additionalFieldsSchema = Yup.object().shape({
  name: Yup.string().required('A Name is required'),
  defaultValue: validateDataTypes(),
});

export const createTicketTypeSchema = Yup.object().shape({
  name: Yup.string().nullable().required('A name for your ticket type is required'),
  tabs: Yup.array().of(Yup.string()).min(1, 'At least one tab is required'),
  parameters: Yup.array().of(additionalFieldsSchema).min(1, 'At least one additional field is required'),
});

export const editPhoneNumberModalValidationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^\d{3}-\d{3}-\d{4}$/, 'Enter a valid North American  phone number in the 123-456-7890 format')
    .required('Phone number is required'),
});

export const chatWidgetCreateEditValidationSchema = Yup.object().shape({
  name: Yup.string().nullable().required('A Name is required'),
  primaryColourHex: Yup.string()
    .required('Primary Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  primaryAccentColourHex: Yup.string()
    .required('Primary Accent Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  secondaryColourHex: Yup.string()
    .required('Secondary Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  secondaryAccentColourHex: Yup.string()
    .required('Secondary Accent Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  backgroundColourHex: Yup.string()
    .required('Background Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  iconColourHex: Yup.string().required('Icon Color is required').matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  notificationTextColourHex: Yup.string()
    .required('Notification Text Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  notificationBackgroundColourHex: Yup.string()
    .required('Notification Background Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
});
