import { PRODUCT_INVENTORY_STATUS_REVERSE_MAP } from '../../constants/constants';
import { PRODUCT_FILTERS, PRODUCT_ORDERS_FILTER_KEY } from '../../constants/productInitialValues';

export const CUSTOMER_FILTERS = {
  BAN: 'ban',
};

export const CUSTOMER_SIDE_FILTER_KEY = 'sideFilter';

export const CUSTOMER_SIDE_FILTER_INITIAL_VALUES = {
  [PRODUCT_FILTERS.CUSTOMER_ID]: '',
  [CUSTOMER_FILTERS.BAN]: '',
  [PRODUCT_FILTERS.EMAIL]: '',
  [PRODUCT_FILTERS.PHONE_NUMBER]: '',
  [PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE]: '',
  [PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE]: '',
  [PRODUCT_FILTERS.BILLING_ADDRESS_ROLE]: '',
};

export const GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES = {
  [PRODUCT_FILTERS.CUSTOMER_ID]: '',
  [PRODUCT_FILTERS.EMAIL]: '',
  [PRODUCT_FILTERS.PHONE_NUMBER]: '',
  [PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE]: '',
  [PRODUCT_FILTERS.BILLING_ADDRESS_ROLE]: '',
  [PRODUCT_FILTERS.ORGANIZATION]: '',
  [PRODUCT_FILTERS.DEPARTMENT]: '',
};

export const CUSTOMERS_INITIAL_VALUES = {
  [CUSTOMER_SIDE_FILTER_KEY]: CUSTOMER_SIDE_FILTER_INITIAL_VALUES,
  ...CUSTOMER_SIDE_FILTER_INITIAL_VALUES,
  search: '',
};

export const GOA_CUSTOMERS_INITIAL_VALUES = {
  [CUSTOMER_SIDE_FILTER_KEY]: GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES,
  ...GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES,
  search: '',
};

export const selectedCustomerFiltersMeta = {
  key: CUSTOMER_SIDE_FILTER_KEY,
  formatter: {
    [PRODUCT_FILTERS.CUSTOMER_ID]: ({ v, k }) => ({
      label: 'Customer ID',
      value: v[PRODUCT_FILTERS.ID] || '',
      k,
    }),
    [CUSTOMER_FILTERS.BAN]: ({ v, k }) => ({
      label: 'BAN',
      value: v[CUSTOMER_FILTERS.BAN] || '',
      k,
    }),
    [PRODUCT_FILTERS.EMAIL]: ({ v, k }) => ({
      label: 'Email',
      value: v[PRODUCT_FILTERS.EMAIL] || '',
      k,
    }),
    [PRODUCT_FILTERS.PHONE_NUMBER]: ({ v, k }) => ({
      label: 'Phone Number',
      value: v[PRODUCT_FILTERS.PHONE_NUMBER] || '',
      k,
    }),
  },
};

export const goASelectedCustomerFiltersMeta = {
  key: CUSTOMER_SIDE_FILTER_KEY,
  formatter: {
    [PRODUCT_FILTERS.CUSTOMER_ID]: ({ v, k }) => ({
      label: 'Customer ID',
      value: v[PRODUCT_FILTERS.ID] || '',
      k,
    }),
    [PRODUCT_FILTERS.EMAIL]: ({ v, k }) => ({
      label: 'Email',
      value: v[PRODUCT_FILTERS.EMAIL] || '',
      k,
    }),
    [PRODUCT_FILTERS.PHONE_NUMBER]: ({ v, k }) => ({
      label: 'Phone Number',
      value: v[PRODUCT_FILTERS.PHONE_NUMBER] || '',
      k,
    }),
    [PRODUCT_FILTERS.ORGANIZATION]: ({ v, k }) => ({
      label: 'Organization',
      value: v[PRODUCT_FILTERS.NAME] || '',
      k,
    }),
    [PRODUCT_FILTERS.DEPARTMENT]: ({ v, k }) => ({
      label: 'Department',
      value: v[PRODUCT_FILTERS.NAME] || '',
      k,
    }),
  },
};

export const customerFormatter = (values) => ({
  [PRODUCT_FILTERS.CUSTOMER_ID]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.CUSTOMER_ID][PRODUCT_FILTERS.ID] || '',
  [CUSTOMER_FILTERS.BAN]: values[CUSTOMER_SIDE_FILTER_KEY][CUSTOMER_FILTERS.BAN] || '',
  [PRODUCT_FILTERS.EMAIL]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.EMAIL][PRODUCT_FILTERS.EMAIL] || '',
  [PRODUCT_FILTERS.PHONE_NUMBER]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.PHONE_NUMBER][PRODUCT_FILTERS.PHONE_NUMBER] || '',
});

export const goACustomerFormatter = (values) => ({
  [PRODUCT_FILTERS.CUSTOMER_ID]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.CUSTOMER_ID][PRODUCT_FILTERS.ID] || '',
  [PRODUCT_FILTERS.EMAIL]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.EMAIL][PRODUCT_FILTERS.EMAIL] || '',
  [PRODUCT_FILTERS.PHONE_NUMBER]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.PHONE_NUMBER][PRODUCT_FILTERS.PHONE_NUMBER] || '',
  [PRODUCT_FILTERS.ORGANIZATION]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.ORGANIZATION][PRODUCT_FILTERS.NAME] || '',
  [PRODUCT_FILTERS.DEPARTMENT]: values[CUSTOMER_SIDE_FILTER_KEY][PRODUCT_FILTERS.DEPARTMENT][PRODUCT_FILTERS.NAME] || '',
});

export const selectedCustomerProfileMeta = {
  key: CUSTOMER_SIDE_FILTER_KEY,
  formatter: {
    [PRODUCT_FILTERS.PURCHASE_DATE]: ({ v, k }) => ({
      label: 'Purchase Date',
      value: v.label || '',
      k,
    }),
    [PRODUCT_FILTERS.STATUS]: ({ v, k }) => ({
      label: 'Status',
      value: v?.map((status) => status?.label) || '',
      k,
    }),
  },
};

export const customerProfileFormatter = (values) => ({
  [PRODUCT_FILTERS.PURCHASE_BEFORE]: values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.PURCHASE_DATE]?.filterValue?.[PRODUCT_FILTERS.PURCHASE_BEFORE] || '',
  [PRODUCT_FILTERS.PURCHASE_AFTER]: values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.PURCHASE_DATE]?.filterValue?.[PRODUCT_FILTERS.PURCHASE_AFTER] || '',
  [PRODUCT_FILTERS.STATUS]: values?.[PRODUCT_ORDERS_FILTER_KEY]?.[PRODUCT_FILTERS.STATUS]?.reduce((acc, status) => [...acc, ...PRODUCT_INVENTORY_STATUS_REVERSE_MAP(status?.label)], []) || '',
  [PRODUCT_FILTERS.RELATED_PARTY_ID]: values[PRODUCT_FILTERS.RELATED_PARTY_ID],
});
