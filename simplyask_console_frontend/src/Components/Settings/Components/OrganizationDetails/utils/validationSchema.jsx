import * as Yup from 'yup';
import { VALIDATION_TYPES, VALIDATION_TYPES_REGEX } from '../../../../PublicFormPage/constants/validationTypes';
import { ORGANIZATION_SETTINGS_API_KEYS } from './constants';

export const editOrganizationDetailsValidationSchema = Yup.object().shape({
  [ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME]: Yup.string()
    .required('A company name is required')
    .min(4, 'Name must be of at least 4 characters'),

  [ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1]: Yup.string().required('An address is required'),

  [ORGANIZATION_SETTINGS_API_KEYS.CITY]: Yup.string().required('A city is required'),

  [ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE]: Yup.string().required('A postal code is required'),

  [ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER]: Yup.string()
    .required('A phone number is required')
    .matches(VALIDATION_TYPES_REGEX[VALIDATION_TYPES.PHONE_NUMBER], 'Enter the number in the +1 222-333-4444 format'),

  [ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]: Yup.object().nullable().required('A country is required'),
  [ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]: Yup.object().nullable().required('A Province is required'),
  [ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]: Yup.object()
    .nullable()
    .required('Number of employees is required'),
});
