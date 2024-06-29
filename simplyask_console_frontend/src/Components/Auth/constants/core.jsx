export const STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS = {
  firstName: 'firstName',
  lastName: 'lastName',
  jobTitle: 'jobTitle',
  workEmail: 'workEmail',
  personalPhoneNumber: 'personalPhoneNumber',
};

export const STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS = {
  companyName: 'companyName',
  streetAddressLine1: 'streetAddressLine1',
  streetAddressLine2: 'streetAddressLine2',
  city: 'city',
  postalCode: 'postalCode',
  organizationPhoneNumbersData: 'organizationPhoneNumbersData',
  countryData: 'countryData',
  provinceData: 'provinceData',
  numberOfEmployees: 'numberOfEmployees',
};

export const STEP_1_PERSONAL_DETAILS_FORM_SCHEMA = {
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.firstName]: '',
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.lastName]: '',
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.jobTitle]: '',
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.workEmail]: '',
  [STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.personalPhoneNumber]: '',
};

export const STEP_2_ORGANIZATION_DETAILS_FORM_SCHEMA = {
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.companyName]: '',
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.countryData]: null,
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine1]: '',
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine2]: '',
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.city]: '',
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.provinceData]: null,
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.postalCode]: '',
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.organizationPhoneNumbersData]: '',
  [STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.numberOfEmployees]: null,
};

export const STEP_3_BILLING_DETAILS_SCHEMA_KEYS = {
  firstName: 'firstName',
  lastName: 'lastName',
  streetAddressLine1: 'streetAddressLine1',
  streetAddressLine2: 'streetAddressLine2',
  city: 'city',
  postalCode: 'postalCode',
  billingPhoneNumbersData: 'billingPhoneNumbersData',
  countryData: 'countryData',
  provinceData: 'provinceData',
  companyName: 'companyName',
};

export const STEP_3_BILLING_DETAILS_FORM_SCHEMA = {
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.firstName]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.lastName]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.countryData]: null,
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine1]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine2]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.city]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.provinceData]: null,
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.postalCode]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.billingPhoneNumbersData]: '',
  [STEP_3_BILLING_DETAILS_SCHEMA_KEYS.companyName]: '',
};
