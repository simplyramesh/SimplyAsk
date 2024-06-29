import * as Yup from 'yup';

import {
  DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA,
} from '../../shared/utils/validation';

export const AGENT_IMPORTED_FILE_INVALID_MSG = 'Agent File is invalid';

export const agentImportedFileSchema = Yup.object().shape({
  settings: Yup.mixed().required(),
  agentConfiguration: Yup.mixed().required(),
  assignedPhoneNumbers: Yup.mixed().required(),
  assignedWidgets: Yup.mixed().required(),
  intents: Yup.mixed().required(),
  nodes: Yup.array().of(Yup.object()).min(1, 'The nodes must contain at least one object'),
  edges: Yup.array().of(Yup.object()).min(1, 'The edges must contain at least one object'),
  viewport: Yup.mixed().nullable(),
  lastStepId: Yup.number().nullable(),
  lastVariantId: Yup.mixed().nullable(),
  lastStepItemId: Yup.mixed().nullable(),
  version: Yup.number().required(),
}).noUnknown(true, 'Object contains unknown keys').strict();

export const getDuplicateAgentValidationSchema = (allAgentsOptions) =>
  Yup.object().shape({
    name: Yup.string()
      .required('An Agent name is required')
      .max(DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.NAME_MAX_LEN, 'Up to 52 characters allowed')
      .test(
        'custom-validation',
        'A different name for your duplicated agent is required',
        (value) =>
          !allAgentsOptions?.find((agent) => agent.name?.toLowerCase()?.trim() === value?.toLowerCase()?.trim())
      ),
    description: Yup.string().max(
      DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.DESCRIPTION_MAX_LEN,
      'Up to 78 characters allowed'
    ),
  });

export const getImportAndReplaceAgentValidationSchema = () => Yup.object().shape({
  importedFile: Yup.mixed().nullable()
    .required('Uploading a file is required'),
  replaceAgent: Yup.object().nullable()
    .required('An Agent is required for replacement'),
});
