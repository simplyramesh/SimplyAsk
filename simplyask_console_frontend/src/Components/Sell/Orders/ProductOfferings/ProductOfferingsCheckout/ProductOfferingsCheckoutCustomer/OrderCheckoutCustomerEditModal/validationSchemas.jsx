import * as Yup from 'yup';

export const customerCreationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First Name must be at least 2 characters')
    .required('First Name is required'),
  lastName: Yup.string()
    .min(2, 'Last Name must be at least 2 characters')
    .required('Last Name is required'),
  email: Yup.string()
    .email('Email must be a valid email address')
    .required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
});

export const goACustomerAddressSchema = Yup.object().shape({
  ...customerCreationSchema.fields,
  orgName: Yup.mixed().required('Organization is required'),
  costCenterId: Yup.string().required('Cost Center Code is required'),
  departmentName: Yup.mixed().required('Department is required'),
  userName: Yup.string().required('User Name is required'),
  shippingAddress: Yup.object().shape({
    country: Yup.mixed().required('Country is required'),
    province: Yup.mixed().required('Province is required'),
    city: Yup.string().required('City is required'),
    postCode: Yup.string().required('Postal/Zip Code is required'),
    streetName: Yup.string().required('Street Address is required'),
  }),
  password: Yup.string()
    .min(12, '12 characters minimum')
    .matches(/(?=.*[a-z])/, 'One lowercase letter')
    .matches(/(?=.*[A-Z])/, 'One uppercase letter')
    .matches(/(?=.*[0-9])/, 'One number')
    .matches(/(?=.*[!@#?%])/, 'One special character (examples: !, @, #, ?, %)'),
  confirmPassword: Yup.string()
    .when('password', {
      is: (password) => !!password,
      then: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
      otherwise: Yup.string().notRequired(),
    }),
});
