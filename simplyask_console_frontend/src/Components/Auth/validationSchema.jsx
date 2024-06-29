import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('An email is required'),
  password: Yup.string().required('A password is required'),
});

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('An email is required'),
});
