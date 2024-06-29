import {
  PRODUCT_INVENTORY_STATUS, PRODUCT_INVENTORY_STATUS_LABELS, PRODUCT_ORDER_STATUS, PRODUCT_ORDER_STATUS_LABELS,
} from './constants';

export const PRODUCT_CUSTOMER_PARAMS = {
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  POSTAL_CODE: 'postalCode',
  CUSTOMER_ID: 'id', // NOTE: Also externalId which can be optionally set by the FE when creating a customer
  BAN: 'ban',
};

export const PRODUCT_SEARCH_BY_OPTIONS = [
  { value: PRODUCT_CUSTOMER_PARAMS.NAME, label: 'Customer Name' },
  { value: PRODUCT_CUSTOMER_PARAMS.EMAIL, label: 'Email' },
  { value: PRODUCT_CUSTOMER_PARAMS.PHONE, label: 'Phone Number' },
  { value: PRODUCT_CUSTOMER_PARAMS.POSTAL_CODE, label: 'Postal or Zip Code' },
  { value: PRODUCT_CUSTOMER_PARAMS.CUSTOMER_ID, label: 'Customer ID' },
  { value: PRODUCT_CUSTOMER_PARAMS.BAN, label: 'Billing Account Number' },
];

export const PRODUCT_ORDER_PLACEHOLDER_MAP = {
  [PRODUCT_CUSTOMER_PARAMS.NAME]: 'First Name, Last Name, or Both...',
  [PRODUCT_CUSTOMER_PARAMS.EMAIL]: 'Email (e.g johnsmith@gmail.com)',
  [PRODUCT_CUSTOMER_PARAMS.PHONE]: 'Phone Number (e.g 123-456-7890)',
  [PRODUCT_CUSTOMER_PARAMS.POSTAL_CODE]: 'Postal or Zip Code (e.g A1A 1A1, 12345)',
  [PRODUCT_CUSTOMER_PARAMS.CUSTOMER_ID]: 'Customer ID (e.g 123456789)',
  [PRODUCT_CUSTOMER_PARAMS.BAN]: 'Billing Account Number (e.g 123456789)',
};

export const PRODUCT_ORDER_CUSTOMER_OPTION_LABEL_MAP = {
  VALUE: 'value',
};

export const SHARED_DROPDOWN_PROPS = {
  minMenuHeight: 150,
  maxMenuHeight: 450,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
};

export const PRODUCT_ORDER_HISTORY_STATUS_MAP = {
  [PRODUCT_ORDER_STATUS.IN_PROGRESS]: {
    label: PRODUCT_ORDER_STATUS_LABELS[PRODUCT_ORDER_STATUS.IN_PROGRESS],
    value: PRODUCT_ORDER_STATUS.IN_PROGRESS,
    color: 'blue',
  },
  [PRODUCT_ORDER_STATUS.COMPLETED]: {
    label: PRODUCT_ORDER_STATUS_LABELS[PRODUCT_ORDER_STATUS.COMPLETED],
    value: PRODUCT_ORDER_STATUS.COMPLETED,
    color: 'green',
  },
  [PRODUCT_ORDER_STATUS.FAILED]: {
    label: PRODUCT_ORDER_STATUS_LABELS[PRODUCT_ORDER_STATUS.FAILED],
    value: PRODUCT_ORDER_STATUS.FAILED,
    color: 'red',
  },
};

export const PRODUCT_CUSTOMER_PROFILE_STATUS_MAP = [
  {
    label: PRODUCT_INVENTORY_STATUS_LABELS.Active,
    value: PRODUCT_INVENTORY_STATUS.ACTIVE,
    color: 'green',
  },
  {
    label: PRODUCT_INVENTORY_STATUS_LABELS.Ceased,
    value: 'CEASED',
    color: 'blue',
  },
  {
    label: PRODUCT_INVENTORY_STATUS_LABELS.Suspended,
    value: PRODUCT_INVENTORY_STATUS.SUSPENDED,
    color: 'yellow',
  },
];

export const GOA_CATEGORY_TYPES = {
  ADMIN: 'admin',
  APP: 'app',
  PLAN: 'plan',
  PLAN_AND_DEVICE: 'planAndDevice',
};

export const GOA_NEW_CUSTOMER_MODAL_ROLE_OPTIONS = [
  { label: 'Enforcement User', value: 'enforcementUser' },
  { label: 'Parking Inspector', value: 'parkingInspector' },
  { label: 'Social Worker', value: 'socialWorker' },
  { label: 'Fire Fighter', value: 'fireFighter' },
  { label: 'Tree Cutter', value: 'treeCutter' },
  { label: 'Admin', value: 'admin' },
  { label: 'SCO', value: 'SCO' },
];
