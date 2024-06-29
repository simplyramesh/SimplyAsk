import { isValid, parseISO } from 'date-fns';

import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../utils/timeUtil';
import { renderRowHoverAction, rowHoverActionColumnProps } from '../../Issues/utills/formatters';
import OpenIcon from '../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import BaseTicketStatus from '../../shared/REDISIGNED/layouts/BaseTicketStatus/BaseTicketStatus';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import {
  PRODUCT_INVENTORY_STATUS_COLORS, PRODUCT_INVENTORY_STATUS_LABELS, PRODUCT_INVENTORY_STATUS_MAPPED_LABELS, PRODUCT_ORDER_STATUS_COLORS, PRODUCT_ORDER_STATUS_LABELS,
} from '../constants/constants';
import { PRODUCT_FILTERS } from '../constants/productInitialValues';

import {
  constructFullName, getCustomerAddress, getTotalSummary, goAProductPrice,
} from './helpers';

export const renderCustomerInfo = ({ cell }) => {
  const value = cell.getValue();

  return value
    ? (<StyledText size={15} weight={400} lh={22}>{value}</StyledText>)
    : (<StyledText size={15} weight={400} lh={22}>N/A</StyledText>);
};

const renderAddressLine = ({ main, secondary, separator = '' }, value, index) => {
  const mainValue = value?.[main];
  const secondaryValue = value?.[secondary];

  if (!mainValue && !secondaryValue) return null;

  const line = mainValue
    ? `${mainValue}${secondaryValue ? `${separator}${secondaryValue}` : ''}`
    : secondaryValue;

  return <StyledText key={index} size={15} weight={400} lh={22}>{line}</StyledText>;
};

export const renderCustomerAddress = ({ cell }) => {
  const value = cell.getValue();

  const addressFields = [
    { main: PRODUCT_FILTERS.STREET_NAME },
    { main: PRODUCT_FILTERS.CITY, secondary: PRODUCT_FILTERS.PROVINCE, separator: ', ' },
    { main: PRODUCT_FILTERS.COUNTRY, secondary: PRODUCT_FILTERS.POSTAL_CODE, separator: ', ' },
  ];

  return value
    ? (
      <StyledFlex>
        {addressFields.map((field, index) => renderAddressLine(field, value, index))}
      </StyledFlex>
    )
    : (<StyledText size={15} weight={400} lh={22}>N/A</StyledText>);
};

export const renderTwoLineDateTime = ({ cell, table }) => {
  const value = cell.getValue();
  const { timezone } = table.options.meta;

  return isValid(parseISO(value))
    ? (
      <StyledFlex>
        <StyledText size={15} weight={400} lh={22}>{getInFormattedUserTimezone(value, timezone, BASE_DATE_FORMAT)}</StyledText>
        <StyledText size={15} weight={400} lh={22}>{getInFormattedUserTimezone(value, timezone, BASE_TIME_FORMAT)}</StyledText>
      </StyledFlex>
    )
    : renderCustomerInfo({ cell });
};

export const renderOrderStatus = ({ cell, table }, productStatusColors, productLabels) => {
  const { theme: { colors, statusColors } } = table.options.meta;
  const status = cell.getValue();
  const label = typeof productLabels === 'function' ? productLabels(status) : productLabels[status] || status;

  const orderStatusColor = productStatusColors(statusColors);
  const bg = orderStatusColor[status]?.bg || 'transparent';
  const color = orderStatusColor[status]?.color || colors.primary;

  return (
    <BaseTicketStatus
      bgProps={{ width: 'auto' }}
      bgColor={bg}
      color={color}
    >
      {label}
    </BaseTicketStatus>
  );
};

export const PRODUCT_ORDER_CUSTOMER = [
  {
    header: 'Customer Name',
    accessorFn: (row) => row.name || `${row.firstName} ${row.lastName}`,
    id: PRODUCT_FILTERS.NAME,
    Cell: renderCustomerInfo,
    size: 360,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Customer ID',
    accessorFn: (row) => row.id,
    id: PRODUCT_FILTERS.ID,
    Cell: renderCustomerInfo,
    size: 158,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'BAN',
    accessorFn: (row) => row.ban,
    id: 'ban',
    Cell: renderCustomerInfo,
    size: 158,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Email',
    accessorFn: (row) => row.email,
    id: PRODUCT_FILTERS.EMAIL,
    Cell: renderCustomerInfo,
    size: 360,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Phone Number',
    accessorFn: (row) => row.phone,
    id: PRODUCT_FILTERS.PHONE_NUMBER,
    Cell: renderCustomerInfo,
    size: 180,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Shipping Address',
    accessorFn: (row) => getCustomerAddress(row.place, PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE),
    id: PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE,
    Cell: ({ cell }) => renderCustomerAddress({ cell }),
    size: 360,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Service Address',
    accessorFn: (row) => getCustomerAddress(row.place, PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE),
    id: PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE,
    Cell: ({ cell }) => renderCustomerAddress({ cell }),
    size: 360,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Billing Address',
    accessorFn: (row) => getCustomerAddress(row.place, PRODUCT_FILTERS.BILLING_ADDRESS_ROLE),
    id: PRODUCT_FILTERS.BILLING_ADDRESS_ROLE,
    Cell: ({ cell }) => renderCustomerAddress({ cell }),
    size: 360,
    align: 'left',
    enableSorting: false,
  },
  {
    header: '',
    id: 'openCustomerProfile',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverAction({
          icon: <StyledFlex as="span"><OpenIcon fontSize="18px" /></StyledFlex>,
          onClick: () => table.options.meta.onCustomerProfile(row.original),
          toolTipTitle: 'Open Customer Profile in a New Tab',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 90,
  },
];

export const PRODUCT_ORDER_HISTORY = [
  {
    header: 'Order ID',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.ID],
    id: PRODUCT_FILTERS.ID,
    Cell: ({ cell }) => (
      <StyledText size={15} weight={400} lh={22} className="showOnRowHover">{cell.getValue()}</StyledText>
    ),
    size: 182,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Order Date',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.ORDER_DATE],
    id: PRODUCT_FILTERS.ORDER_DATE,
    Cell: renderTwoLineDateTime,
    size: 148,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Customer',
    accessorFn: (row) => constructFullName(row.productOrderItem?.[0]?.product?.relatedParty?.[0]),
    id: PRODUCT_FILTERS.CUSTOMER,
    Cell: renderCustomerInfo,
    size: 292,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Customer ID',
    accessorFn: (row) => row.productOrderItem?.[0]?.product?.relatedParty?.[0]?.id,
    id: PRODUCT_FILTERS.CUSTOMER_ID,
    Cell: renderCustomerInfo,
    size: 158,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Total',
    accessorFn: (row) => `$${getTotalSummary(row?.productOrderItem?.filter((item) => item.topOffer))?.estimatedTotal || 0}`,
    id: 'total',
    Cell: renderCustomerInfo,
    size: 158,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Order Status',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.STATE],
    id: PRODUCT_FILTERS.STATE,
    Cell: ({ cell, table }) => renderOrderStatus({ cell, table }, PRODUCT_ORDER_STATUS_COLORS, PRODUCT_ORDER_STATUS_LABELS),
    size: 159,
    align: 'center',
    enableSorting: false,
  },
  {
    header: 'Items in Order',
    accessorFn: (row) => row.productOrderItem.filter((item) => item.topOffer).length,
    id: 'numberOfItems',
    Cell: renderCustomerInfo,
    size: 360,
    align: 'left',
    enableSorting: false,
  },
];

export const CUSTOMER_PROFILE = [
  {
    header: 'Product',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.NAME],
    id: PRODUCT_FILTERS.NAME,
    Cell: ({ cell }) => (
      <StyledText size={15} weight={400} lh={22} className="showOnRowHover">{cell.getValue()}</StyledText>
    ),
    size: 313,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Purchase Date',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.CREATED_DATE],
    id: PRODUCT_FILTERS.CREATED_DATE,
    Cell: renderTwoLineDateTime,
    size: 176,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Billing Date',
    accessorFn: (row) => (PRODUCT_INVENTORY_STATUS_MAPPED_LABELS(row.status) === PRODUCT_INVENTORY_STATUS_LABELS.Ceased
      ? 'Product is currently not being billed to customer due to being "Ceased"'
      : row?.billingDate),
    id: 'billingDate',
    Cell: renderTwoLineDateTime,
    size: 346,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Price',
    accessorFn: (row) => `$${getTotalSummary(row?.productPrice)?.total || 0} / month`,
    id: 'price',
    Cell: renderCustomerInfo,
    size: 244,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.STATUS],
    id: PRODUCT_FILTERS.STATUS,
    Cell: ({ cell, table }) => renderOrderStatus({ cell, table }, PRODUCT_INVENTORY_STATUS_COLORS, PRODUCT_INVENTORY_STATUS_MAPPED_LABELS),
    size: 158,
    align: 'center',
    enableSorting: false,
  },
];

export const GOA_CUSTOMER_PROFILE = [
  {
    header: 'Product',
    accessorFn: (row) => row?.productOffering?.name,
    id: PRODUCT_FILTERS.NAME,
    Cell: ({ cell }) => (
      <StyledText size={15} weight={400} lh={22} className="showOnRowHover">{cell.getValue()}</StyledText>
    ),
    size: 313,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Purchase Date',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.CREATED_DATE],
    id: PRODUCT_FILTERS.CREATED_DATE,
    Cell: renderTwoLineDateTime,
    size: 176,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Billing Date',
    accessorFn: (row) => (PRODUCT_INVENTORY_STATUS_MAPPED_LABELS(row.status) === PRODUCT_INVENTORY_STATUS_LABELS.Ceased
      ? 'Product is currently not being billed to customer due to being "Ceased"'
      : row?.billingDate),
    id: 'billingDate',
    Cell: renderTwoLineDateTime,
    size: 346,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Price',
    accessorFn: (row) => {
      const goARecurringProductPrice = goAProductPrice(row?.productPrice);

      return `$${goARecurringProductPrice?.price || 0} / ${goARecurringProductPrice?.unit}`;
    },
    id: 'price',
    Cell: renderCustomerInfo,
    size: 244,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => row?.[PRODUCT_FILTERS.STATUS],
    id: PRODUCT_FILTERS.STATUS,
    Cell: ({ cell, table }) => renderOrderStatus({ cell, table }, PRODUCT_INVENTORY_STATUS_COLORS, PRODUCT_INVENTORY_STATUS_MAPPED_LABELS),
    size: 158,
    align: 'center',
    enableSorting: false,
  },
];
