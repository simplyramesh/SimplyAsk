import * as Yup from 'yup';
import { EXECUTION_FRAMEWORKS } from '../../../shared/constants/core';

export const importAndReplaceTestCaseValidationSchema = Yup.object().shape({
  importedFile: Yup.mixed().nullable().required('Uploading a file is required'),
  replaceTestCase: Yup.object().nullable().required('A Test Case is required for replacement'),
});

export const importTestCaseFileSchema = Yup.object()
  .shape({
    options: Yup.mixed().required(),
    attributes: Yup.mixed().required(),
    nodes: Yup.mixed().required(),
    edges: Yup.mixed().required(),
    processType: Yup.string()
      .oneOf([EXECUTION_FRAMEWORKS.RPA, EXECUTION_FRAMEWORKS.CUCUMBER.toUpperCase()])
      .required('Test file must be of type RPA or CUCUMBER'),
  })
  .noUnknown(true, 'Object contains unknown keys')
  .strict();
