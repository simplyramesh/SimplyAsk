import * as Yup from 'yup';

export const CREATE_TEST_RUN_VALIDATION_SCHEMA = Yup.object().shape({
  // add initial values to the schema
  name: Yup.string().required('Test Run Name is Required').default(''),
  testSuiteIds: Yup.array().of(Yup.object()).min(1, 'Test Suites Selection is Required').default([]),
  environments: Yup.array().of(Yup.object()).min(1, 'Environment Selection is Required').default([]),
});
