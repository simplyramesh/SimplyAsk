import * as Yup from 'yup';

export const publicSubmissionFormValidationSchema = Yup.object().shape({
  isEnabled: Yup.boolean(),
  title: Yup.string()
    .when('isEnabled', {
      is: true,
      then: Yup.string().required('A Title is required').max(200, 'Title cannot be more than 200 characters'),
      otherwise: Yup.string(),
    }),
  description: Yup.string()
    .when('isEnabled', {
      is: true,
      then: Yup.string().required('A Description is required').max(200, 'Description cannot be more than 200 characters'),
      otherwise: Yup.string(),
    }),
  isPasswordEnabled: Yup.boolean(),
  password: Yup.string()
    .when('isPasswordEnabled', {
      is: true,
      then: Yup.string().required('A Password is required').max(52, 'Password cannot be more than 52 characters'),
      otherwise: Yup.string(),
    }),
});
