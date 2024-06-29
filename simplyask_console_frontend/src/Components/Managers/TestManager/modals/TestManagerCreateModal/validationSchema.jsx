import * as Yup from 'yup';

export const createTestCaseSchema = (allTestCasesOptions = []) =>
  Yup.object().shape({
    displayName: Yup.string()
      .required('Name is required')
      .test('custom-validation', 'A unique name for your imported test case is required', (value) => {
        return !allTestCasesOptions?.find(
          (testCase) => testCase.displayName?.toLowerCase()?.trim() === value?.toLowerCase()?.trim()
        );
      }),
    type: Yup.object().required('Type is required'),
  });


export const createTestGroupSuiteSchema = (dynamicValue = '') =>
  Yup.object().shape({
    displayName: Yup.string()
      .required('Name is required')
      .test('is-not-dynamic-value', 'A unique name for your duplicate test case is required', (value) => {
        if (dynamicValue) {
          return value !== dynamicValue;
        }

        return true;
      }),
  });
