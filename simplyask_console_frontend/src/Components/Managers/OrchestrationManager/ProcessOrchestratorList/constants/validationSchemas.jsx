import * as Yup from 'yup';

export const createProcessOrchestration = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});
