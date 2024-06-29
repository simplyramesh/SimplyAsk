import * as Yup from 'yup';

export const supportRequestValidationSchema = Yup.object().shape({
  subject: Yup.mixed().required('A subject is required'),
  message: Yup.string().required('A message is required'),
});
