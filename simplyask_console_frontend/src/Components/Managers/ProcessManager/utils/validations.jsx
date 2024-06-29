import * as Yup from 'yup';

import { VALIDATION_TYPES, VALIDATION_TYPES_REGEX } from '../../../PublicFormPage/constants/validationTypes';
import { DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA } from '../../shared/utils/validation';

export const PROCESS_IMPORTED_FILE_INVALID_MSG = 'Process File is invalid';

export const processImportedFileSchema = Yup.object()
  .shape({
    options: Yup.mixed().required(),
    attributes: Yup.mixed().required(),
    nodes: Yup.mixed().required(),
    edges: Yup.mixed().required(),
    processType: Yup.mixed().required(),
  })
  .noUnknown(true, 'Object contains unknown keys')
  .strict();

export const addNewProcessValidationSchema = Yup.object().shape({
  displayName: Yup.string()
    .required('A Process name is required')
    .max(DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.NAME_MAX_LEN, 'Up to 52 characters allowed')
    .test('is-first-char-alpha', 'The first character must be an alphabet letter', (value) =>
      VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ALPHABET].test(value?.[0])
    ),
  description: Yup.string().max(
    DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.DESCRIPTION_MAX_LEN,
    'Up to 78 characters allowed'
  ),
});

export const getDuplicateProcessValidationSchema = (allProcessesOptions) =>
  Yup.object().shape({
    displayName: Yup.string()
      .required('A Process name is required')
      .max(DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.NAME_MAX_LEN, 'Up to 52 characters allowed')
      .test('is-first-char-alpha', 'The first character must be an alphabet letter', (value) =>
        VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ALPHABET].test(value?.[0])
      )
      .test(
        'custom-validation',
        'A unique name for your duplicated process is required',
        (value) =>
          !allProcessesOptions?.find((process) => process.label?.toLowerCase()?.trim() === value?.toLowerCase()?.trim())
      ),
    description: Yup.string().max(
      DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.DESCRIPTION_MAX_LEN,
      'Up to 78 characters allowed'
    ),
  });

export const getImportAndReplaceProcessValidationSchema = () =>
  Yup.object().shape({
    importedFile: Yup.mixed().nullable().required('Uploading a file is required'),
    replaceProcess: Yup.object().nullable().required('A Process is required for replacement'),
  });
