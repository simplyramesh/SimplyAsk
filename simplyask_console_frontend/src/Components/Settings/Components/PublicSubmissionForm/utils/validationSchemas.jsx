import * as Yup from 'yup';

import { hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG } from '../../FrontOffice/utils/validationSchemas';

import { PUBLIC_FORM_THEME_VALUES } from './constants';

export const editPublicFormValidationSchema = Yup.object().shape({
  buttonColourHex: Yup.string().required('Button Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  buttonTextColourHex: Yup.string().required('Button Text Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  accentColourHex: Yup.string().required('Accent Color is required')
    .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
  pageColourHex: Yup.string().when('theme', {
    is: (value) => value === PUBLIC_FORM_THEME_VALUES.LIGHT,
    then: Yup.string().required('Page Color is required')
      .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
    otherwise: Yup.string(),
  }),
  headerColourHex: Yup.string().when('theme', {
    is: (value) => value === PUBLIC_FORM_THEME_VALUES.LIGHT,
    then: Yup.string().required('Banner Color is required')
      .matches(hexColorRegex, YUP_HEX_COLOR_VALIDATION_MSG),
    otherwise: Yup.string(),
  }),

});
