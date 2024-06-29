import * as Yup from 'yup';

const sharedUserFormValidation = {
  firstName: Yup.string().required('A first name is required'),
  lastName: Yup.string().required('A last name is required'),
  timezone: Yup.string().required('Select a time zone'),
  email: Yup.string()
    .email('This is an invalid email address. It must be in the name@example.com format.')
    .required('An email is required'),
};

export const EDIT_USER_VALIDATION_SCHEMA = Yup.object().shape(sharedUserFormValidation);

export const ADD_USER_VALIDATION_SCHEMA = Yup.object().shape({
  ...sharedUserFormValidation,

  password: Yup.string()
    .required('Password is required')
    .min(12, '12 characters minimum')
    .matches(/(?=.*[a-z])/, 'Missing Requirements')
    .matches(/(?=.*[A-Z])/, 'Missing Requirements')
    .matches(/(?=.*[0-9])/, 'Missing Requirements')
    .matches(/(?=.*[!@#?%])/, 'Missing Requirements'),
  // confirmPassword: Yup.string()
  //   .when('password', {
  //     is: (password) => !!password,
  //     then: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
  //     otherwise: Yup.string().notRequired(),
  //   }),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const CHANGE_PASSWORD_VALIDATION_SCHEMA = Yup.object().shape({
  password: ADD_USER_VALIDATION_SCHEMA.fields.password.required(),
  confirmPassword: ADD_USER_VALIDATION_SCHEMA.fields.confirmPassword.required(),
});

export const USER_GROUP_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required('A User Group name is required'),
  description: Yup.string(),
});

export const ADD_PERMISSION_GROUP_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required('A Permission Group name is required'),
  description: Yup.string(),
});
