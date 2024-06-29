import { VALIDATION_TYPES } from "../../../../PublicFormPage/constants/validationTypes";

export const ENVIRONMENTS_PAGE_SIZE = 10;

export const DEFAULT_NO_ENV_OPTION_NAME = { id: 'unique-id-for-no-env', description: 'No Environment', envName: 'No Environment' };

export const ENVIRONMENT_PARAMETERS_SET_EMPTY_MODEL = {
  name: '',
  value: '',
  type: VALIDATION_TYPES.GENERIC,
};