export const ADD_USER = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  COMPANY_NAME: 'companyName',
  COUNTRY: 'country',
  COUNTRY_CODE: 'code',
  PROVINCE: 'province',
  PROVINCE_NAME: 'provinceName',
  CITY: 'city',
  PHONE: 'phone',
  EMAIL: 'email',
  TIMEZONE: 'timezone',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  PFP: 'pfp',
  IS_LOCKED: 'isLocked',
};

export const ADD_USER_GROUP = {
  NAME: 'name',
  DESCRIPTION: 'description',
};

export const USER_FIND_BY_ID_RESPONSE = {
  ID: 'id',
  FIRST_NAME: ADD_USER.FIRST_NAME,
  LAST_NAME: ADD_USER.LAST_NAME,
  COMPANY_NAME: 'organizationName',
  BILLING_COUNTRY: 'billingCountry',
  BILLING_COUNTRY_NAME: 'name',
  BILLING_PROVINCE: 'billingProvince',
  BILLING_PROVINCE_NAME: 'provinceName',
  CITY: ADD_USER.CITY,
  PHONE: ADD_USER.PHONE,
  EMAIL: ADD_USER.EMAIL,
  TIMEZONE: ADD_USER.TIMEZONE,
  PFP: ADD_USER.PFP,
  IS_LOCKED: ADD_USER.IS_LOCKED,
  CREATED: 'createdDate',
  MODIFIED: 'modifiedDate',
};
