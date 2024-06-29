import { ComponentsConfiguration } from '../../shared/REDISIGNED/table-v2/BaseTable/BaseTable';

export const handleCustomerRowClick = (row, table) => {
  table.options.meta.onCustomer(row.original);
  row.toggleSelected();
};

const handleOrderHistoryRowClick = (row, table) => {
  table.options.meta.onOrderHistory(row.original);
};

const handleCustomerProfileOrderRowClick = (row, table) => {
  table.options.meta.onOrderDetails(row.original);
};

export const tableBodyRowProps = ({ row, table, onRowClick }) => ({
  ...ComponentsConfiguration.muiTableBodyRowProps,
  sx: (theme) => ({
    ...ComponentsConfiguration.muiTableBodyRowProps.sx(theme),
    '&:hover .showOnRowHover': {
      display: 'flex',
      color: theme.colors.linkColor,
      fontWeight: 500,
    },
  }),
  onClick: () => onRowClick(row, table),
});

export const tableBodyCellProps = ({ column }) => ({
  ...ComponentsConfiguration.muiTableBodyCellProps({ column }),
  sx: (theme) => ({
    ...ComponentsConfiguration.muiTableBodyCellProps({ column }).sx(theme),
    cursor: 'pointer',
  }),
});

export const PRODUCT_ORDER_CUSTOMER_SEARCH_TABLE_PROPS = {
  enableMultiRowSelection: false,
  enablePagination: false,
  enableGlobalFilter: false,
  muiTableBodyCellProps: tableBodyCellProps,
  muiTableBodyRowProps: ({ row, table }) => tableBodyRowProps({ row, table, onRowClick: handleCustomerRowClick }),
  muiSelectCheckboxProps: ({ row, table }) => ({
    ...ComponentsConfiguration.muiSelectCheckboxProps,
    onClick: () => handleCustomerRowClick(row, table),
  }),
  displayColumnDefOptions: {
    'mrt-row-select': {
      header: '',
      size: 58,
      muiTableBodyCellProps: {
        sx: {
          textAlign: 'center',
          '&:hover': {
            border: 'none',
            outline: 'none',
          },
        },
      },
    },
  },
};

export const PRODUCT_ORDER_HISTORY_TABLE_PROPS = {
  enableMultiRowSelection: false,
  enablePagination: false,
  enableGlobalFilter: false,
  muiTableBodyRowProps: ({ row, table }) => tableBodyRowProps({ row, table, onRowClick: handleOrderHistoryRowClick }),
  muiTableBodyCellProps: tableBodyCellProps,
};

export const PRODUCT_CUSTOMER_PROFILE_TABLE_PROPS = {
  enableMultiRowSelection: false,
  enablePagination: false,
  enableGlobalFilter: false,
  muiTableBodyRowProps: ({ row, table }) => tableBodyRowProps({ row, table, onRowClick: handleCustomerProfileOrderRowClick }),
  muiTableBodyCellProps: tableBodyCellProps,
};

export const PRODUCT_ORDER_CUSTOMER_TABLE_PROPS = {
  enablePagination: false,
  enableGlobalFilter: false,
  muiTableBodyRowProps: ({ row, table }) => tableBodyRowProps({ row, table, onRowClick: () => {} }),
  muiTableBodyCellProps: tableBodyCellProps,
};
