import { array, object, string } from 'yup';

export const jobValidationSchema = object().shape({
  processId: string().required('Selecting a Process is Required'),
  params: array().test('params', 'Params are required', (params) => {
    return params.filter(param => param.fieldCriteria === 'M').every((param) => !!param.value?.toString());
  }),
});
