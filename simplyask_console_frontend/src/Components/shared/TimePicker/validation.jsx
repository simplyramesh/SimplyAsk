import * as yup from 'yup';

export const timepickerScheme = yup.object().shape({
  hours: yup.number().required('Select valid hours')
    .min(0, 'Select valid hours')
    .max(12, 'Select valid hours'),
  minutes: yup.number()
    .required('Select valid minutes')
    .min(0, 'Select valid minutes')
    .max(59, 'Select valid minutes'),
  AmPm: yup.object().required(),
});
