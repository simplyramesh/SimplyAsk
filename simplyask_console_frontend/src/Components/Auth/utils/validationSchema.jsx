import * as Yup from 'yup';
import {
  STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS,
  STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS,
  STEP_3_BILLING_DETAILS_SCHEMA_KEYS,
} from '../constants/core';

const PHONE_NUMBER_REGEX = /^\d{3}-\d{3}-\d{4}$/;
const PHONE_NUMBER_VALIDATION_MESSAGE = 'Enter a valid Phone number must be in the 222-333-4444 format';

export const organizationDetailsSchema = () =>
  Yup.object().shape({
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.companyName]: Yup.string()
      .required('A company name is required')
      .min(4, 'Name must be of at least 4 characters'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine1]: Yup.string().required('An address is required'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.city]: Yup.string().required('A city is required'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.postalCode]: Yup.string().required('A postal code is required'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.countryData]: Yup.object().nullable().required('Select a Country'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.provinceData]: Yup.object().nullable().required('Select a Province/State'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.numberOfEmployees]: Yup.object().nullable().required('Select a Number'),
    [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.organizationPhoneNumbersData]: Yup.string()
      .matches(PHONE_NUMBER_REGEX, PHONE_NUMBER_VALIDATION_MESSAGE)
      .required('Phone Number is required'),
  });

export const personalDetailsSchema = Yup.object().shape({
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.firstName]: Yup.string().required('A first name is required'),
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.lastName]: Yup.string().required('A last name is required'),
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.jobTitle]: Yup.string().required('Your job title is required'),
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.workEmail]: Yup.string()
    .email('Please enter a valid email address')
    .required('Work email is required'),
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.personalPhoneNumber]: Yup.string()
    .matches(PHONE_NUMBER_REGEX, PHONE_NUMBER_VALIDATION_MESSAGE)
    .required('Phone Number is required'),
});

export const billingDetailsSchema = (selectRadioGroupString, radioOptions) =>
  Yup.object().shape({
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine1]: Yup.string().required('An address is required'),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.city]: Yup.string().required('A city is required'),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.postalCode]: Yup.string().required('A postal code is required'),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.firstName]:
      selectRadioGroupString === radioOptions[0].value
        ? Yup.string().required('A first name is required')
        : Yup.string(),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.lastName]:
      selectRadioGroupString === radioOptions[0].value
        ? Yup.string().required('A last name is required')
        : Yup.string(),

    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.companyName]:
      selectRadioGroupString === radioOptions[1].value
        ? Yup.string().required('A company name is required')
        : Yup.string(),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.billingPhoneNumbersData]: Yup.string()
      .matches(PHONE_NUMBER_REGEX, PHONE_NUMBER_VALIDATION_MESSAGE)
      .required('Phone Number is required'),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.countryData]: Yup.object().nullable().required('Select a Country'),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.provinceData]: Yup.object().nullable().required('Select a Province/State'),
  });
