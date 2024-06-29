import { convertIsoWithOffsetToIso } from '../../../utils/timeUtil';
import { CUSTOMER_ROLE } from '../constants/constants';
import { PRODUCT_FILTERS, PRODUCT_ORDERS_FILTER_KEY } from '../constants/productInitialValues';
import { GOA_CATEGORY_TYPES } from '../constants/productOptions';
// NOTE: This may be used for international currency, adds CA $ to the front of the number if currency is CAD
export const formatNumberToCurrency = (num) => (Number.isInteger(num) ? num.toString() : num.toFixed(2));

export const getExpiryDate = (expiryDate, timezone) => convertIsoWithOffsetToIso(expiryDate, timezone, 'LLLL dd, yyyy');

export const findIndexByProperty = (array, property, targetValue) =>
  array.findIndex((obj) => obj[property] === targetValue);

export const extractProductBodyData = (product) =>
  product.prodSpecCharValueUse.flatMap((characteristic) =>
    characteristic.productSpecCharacteristicValue?.reduce(
      (acc, valueObj) =>
        valueObj.isDefault
          ? [
              ...acc,
              {
                post: characteristic.name,
                bold: `${valueObj.value} ${valueObj.unitOfMeasure}`,
              },
            ]
          : acc,
      []
    )
  );

export const extractGoAProductBodyData = (productPrice) => {
  const body = productPrice.reduce((acc, price) => {
    if (price.priceType === 'onetime') {
      return [...acc, { pre: price.name, bold: `$${formatNumberToCurrency(price.price.dutyFreeAmount.value)}` }];
    }

    return acc;
  }, []);

  return body;
};

export const goAProductPrice = (productPrice) =>
  productPrice?.reduce(
    (acc, price) => {
      if (price.priceType === 'recurring') {
        return {
          ...acc,
          price: formatNumberToCurrency(price.price.dutyFreeAmount.value),
          unit: 'month',
          priceWithTax: price?.price?.taxIncludedAmount?.value || price?.price?.dutyFreeAmount?.value,
          currency: price.unitOfMeasure,
        };
      }
      return acc;
    },
    { price: 0, unit: 'month' }
  );

export const createProductDetail = (product, icon = null) => ({
  product,
  icon,
  title: product.name,
  description: product.description,
  expiryDate: product.validFor?.endDateTime || null,
  pricePerUnit: goAProductPrice(product.productOfferingPrice),
  body: extractGoAProductBodyData(product.productOfferingPrice),
});

export const createDefaultProductDetail = (product, icon = null) => ({
  product,
  icon,
  title: product.name,
  description: product.description,
  expiryDate: product.validFor?.endDateTime || null,
  pricePerUnit: {
    price: product.productOfferingPrice[0]?.price?.dutyFreeAmount?.value || 0,
    unit: product.productOfferingPrice[0]?.price?.frequency || 'month',
  },
  body: extractProductBodyData(product), // NOTE: Wait for finalized figma before removing
});

export const filterByCategory = (category) => (acc, product) =>
  product?.categories[0]?.name === category ? [...acc, createProductDetail(product)] : acc;

// NOTE: This is the original function to use for default category filtering
export const defaultFilterByCategory = (category) => (acc, product) =>
  product?.categories[0]?.name === category && product?.isBundle ? [...acc, createDefaultProductDetail(product)] : acc;

export const getCategoryData = (data, category) => data?.reduce(filterByCategory(category), []);

export const getDefaultCategoryData = (data, category) => data.reduce(defaultFilterByCategory(category), []);

export const createBundledProducts = (arr, bundleIds) =>
  arr.reduce(
    (acc, bundle) =>
      bundleIds.includes(bundle.id)
        ? [...acc, createProductDetail(bundle, bundle.categories[0]?.name.toUpperCase())]
        : acc,
    []
  );

export const transformData = (data) =>
  data.reduce((acc, product) => {
    if (product?.categories.length) return acc;

    const bundleIds = product.bundledProductOffering.map((bundle) => bundle.id);

    return [
      ...acc,
      {
        ...createProductDetail(product),
        bundledOffers: createBundledProducts(data, bundleIds),
      },
    ];
  }, []);

export const productsSelectedFiltersFormatter = (obj) =>
  Object.keys(obj).map((fieldName) => {
    const fieldValue = Object.keys(obj[fieldName]).reduce(
      (acc, key) => (obj[fieldName][key] ? [...acc, key] : acc),
      []
    );

    return { fieldName, fieldValue };
  });

export const removeEmptyFilterParams = (filterParams) => {
  const params = Object.entries(filterParams).reduce(
    (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
    {}
  );

  return params;
};

export const filterOrderItemsById = (items, id) => items?.filter((item) => item.id !== id) || [];

export const filterReqByProductId = (reqItems, id) => reqItems?.filter((item) => item.productOffering.id !== id) || [];

export const findCategoryName = (products, id) => {
  const product = products.data.find((p) => p.id === id);
  return product ? product.categories[0].name : null;
};

export const generateRandomIntegerId = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getCustomerAddress = (place, role, includeRole = false) => {
  const addressArray = Array.isArray(place) ? place : [place];

  return addressArray.reduce(
    (acc, address) =>
      includeRole || address?.role === role
        ? {
            ...acc,
            [PRODUCT_FILTERS.STREET_NAME]: address?.[PRODUCT_FILTERS.STREET_NAME] || '',
            [PRODUCT_FILTERS.CITY]: address?.[PRODUCT_FILTERS.CITY] || '',
            [PRODUCT_FILTERS.POSTAL_CODE]: address?.[PRODUCT_FILTERS.POSTAL_CODE] || '',
            [PRODUCT_FILTERS.COUNTRY]:
              address?.[PRODUCT_FILTERS.COUNTRY]?.value ||
              address?.[PRODUCT_FILTERS.COUNTRY]?.label ||
              address?.[PRODUCT_FILTERS.COUNTRY] ||
              '',
            [PRODUCT_FILTERS.PROVINCE]:
              address?.[PRODUCT_FILTERS.PROVINCE]?.value || address?.[PRODUCT_FILTERS.PROVINCE] || '',
            ...(includeRole && { role }),
          }
        : acc,
    {}
  );
};

export const formatPhoneNumber = (str) => str?.replace(/(\+\d)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4') || '';

export const calculateTotal = (orderItems, valueCalculation) =>
  orderItems?.reduce((total, item) => {
    const priceArr = item.itemPrice || item.productPrice || [];
    const itemTotal = priceArr.reduce((acc, price) => valueCalculation(price) + acc, 0);
    return itemTotal + total;
  }, 0);

export const subtotalCalculation = (price) => (price.price ? price.price.dutyFreeAmount.value : 0);
export const taxCalculation = (price) =>
  price.price ? (price.price.taxRate / 100) * price.price.dutyFreeAmount.value : 0;

export const getGoATotalSummary = (orderItems) => {
  const subtotal = calculateTotal(orderItems, subtotalCalculation);
  const estimatedTaxes = calculateTotal(orderItems, taxCalculation);

  return {
    subtotal: subtotal.toFixed(2),
    savings: '0.00',
    estimatedTotal: (subtotal + estimatedTaxes).toFixed(2),
    estimatedTaxes: estimatedTaxes.toFixed(2),
  };
};

export const getTotalSummary = (orderItems) => {
  const taxRate = (item) => item.itemPrice?.[0]?.price?.taxRate || item?.price?.taxRate || 0;
  const dutyFreeAmount = (item) =>
    item.itemPrice?.[0]?.price?.dutyFreeAmount?.value || item?.price?.dutyFreeAmount?.value || 0;

  const subtotal = orderItems?.reduce((total, item) => dutyFreeAmount(item) + total, 0);
  const estimatedTaxes = orderItems?.reduce(
    (totalTax, item) => (taxRate(item) / 100) * dutyFreeAmount(item) + totalTax,
    0
  );
  const totalSummary = {
    total: subtotal?.toFixed(2),
    savings: 0,
    estimatedTotal: (subtotal + estimatedTaxes)?.toFixed(2),
    estimatedTaxes: estimatedTaxes?.toFixed(2),
  };
  return totalSummary;
};

// until BE is not sending role
const findCustomer = (relatedParty) => relatedParty.find((party) => party.role === CUSTOMER_ROLE) || relatedParty[0];

const mapPlace = (orderItem, customer) => ({
  ...orderItem,
  product: {
    ...orderItem.product,
    place: customer.place,
  },
});

const mapRelatedParty = (orderItem, customer) => ({
  ...orderItem,
  product: {
    ...orderItem.product,
    relatedParty: [
      {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
      ...(orderItem.product.relatedParty || []),
    ],
  },
});

export const mapWithCustomerAndPlace = (orderItems, relatedParty) => {
  const customer = findCustomer(relatedParty);
  if (customer) {
    return orderItems.map((orderItem) => {
      const orderItemWithPlace = mapPlace(orderItem, customer);
      return mapRelatedParty(orderItemWithPlace, customer);
    });
  }
  return orderItems;
};

export const getOrderConfig = (productOrder) => ({
  requestedStartDate: productOrder?.requestedStartDate,
  orderDate: productOrder?.orderDate,
  reason: productOrder?.reason,
  description: productOrder?.description,
});

export const constructFullName = (relatedParty) => {
  const firstName = relatedParty?.firstName;
  const lastName = relatedParty?.lastName;
  const fullName = firstName && lastName ? ` ${firstName || ''} ${lastName || ''}` : ` ${relatedParty?.name || ''}`;
  return fullName;
};

export const selectedOrderHistoryFiltersMeta = {
  key: PRODUCT_ORDERS_FILTER_KEY,
  formatter: {
    [PRODUCT_FILTERS.CUSTOMER]: ({ v, k }) => ({
      label: 'Customer',
      value: v.label || '',
      k,
    }),
    [PRODUCT_FILTERS.ORDER_DATE]: ({ v, k }) => ({
      label: 'Order Date',
      value: v.label || '',
      k,
    }),
    [PRODUCT_FILTERS.STATUS]: ({ v, k }) => ({
      label: 'Status',
      value: v?.map((status) => status?.label) || '',
      k,
    }),
    [PRODUCT_FILTERS.CUSTOMER_ID]: ({ v, k }) => ({
      label: 'Customer ID',
      value: v.label || '',
      k,
    }),
  },
};

export const orderHistoryFormatter = (values) => ({
  [PRODUCT_FILTERS.CUSTOMER]: values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.CUSTOMER]?.value || '',
  [PRODUCT_FILTERS.CUSTOMER_ID]: values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.CUSTOMER_ID]?.value || '',
  [PRODUCT_FILTERS.ORDER_START_DATE]: values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.ORDER_DATE]?.value?.[0] || '',
  [PRODUCT_FILTERS.ORDER_END_DATE]: values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.ORDER_DATE]?.value?.[1] || '',
  [PRODUCT_FILTERS.STATUS]:
    values[PRODUCT_ORDERS_FILTER_KEY][PRODUCT_FILTERS.STATUS]?.map((status) => status?.value) || '',
});

export const csvOptions = (columns, fileName) => ({
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  useBom: true,
  useKeysAsHeaders: false,
  columnHeaders: columns.map((c) => ({ key: c.id, displayLabel: c.header })),
  filename: fileName,
});

export const updateAddressValues = (value, addressRole, sourceRole) => {
  if (value[`${addressRole}Use${sourceRole}Address`]) {
    value[addressRole] = value[PRODUCT_FILTERS[`${sourceRole.toUpperCase()}_ADDRESS_ROLE`]];

    return value[addressRole];
  }
};

export const getProductConfiguration = (localStorage) =>
  localStorage?.data?.productOrderItem?.[0]?.productOrderItem?.[1];
export const updateProductConfiguration = (storage, val = {}) => {
  try {
    storage.data.productOrderItem[0].productOrderItem[1].product.productCharacteristic = Object.keys(val)?.map(
      (key) => ({ name: key, value: val[key] })
    );
  } catch (error) {
    console.log(error);
  }
};

export const getIsGoaProductConfigurationsEnabled = (isGoACustomer, categories = []) =>
  ![GOA_CATEGORY_TYPES.ADMIN, GOA_CATEGORY_TYPES.APP].some((category) => categories?.includes(category)) &&
  isGoACustomer;
