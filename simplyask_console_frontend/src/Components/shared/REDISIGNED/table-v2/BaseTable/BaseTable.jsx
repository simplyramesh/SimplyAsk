import MaterialReactTable from 'material-react-table';
import { useEffect, useState } from 'react';

import EmptyTable from '../EmptyTable/EmptyTable';

export const ComponentsConfiguration = {
  muiTablePaperProps: {
    sx: {
      boxShadow: 'none',
      backgroundColor: 'transparent',
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
    },
  },
  muiTableContainerProps: {
    sx: ({ colors }) => ({
      height: '100%',

      '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        backgroundColor: colors.tableScrollThumb,
        border: `4px solid ${colors.tableScrollBg}`,
      },

      '&::-webkit-scrollbar': {
        backgroundColor: colors.tableScrollBg,
      },

      '&::-webkit-scrollbar-track': {
        backgroundColor: colors.tableScrollBg,
      },
    }),
  },
  muiTableProps: {
    sx: {
      tableLayout: 'fixed',
    },
  },
  muiTableHeadRowProps: {
    sx: {
      boxShadow: 'none',
    },
  },
  muiTableHeadCellProps: ({ column }) => ({
    align: column.columnDef.align ?? 'left',
    sx: ({ colors }) => ({
      paddingTop: '14px',
      paddingBottom: '18px',
      paddingLeft: '16px',
      paddingRight: '16px',

      borderBottom: `1px solid ${colors.primary}`,

      backgroundColor: colors.white,

      fontSize: '15px',
      lineHeight: '18px',
      fontWeight: '600',
      color: colors.primary,
      verticalAlign: 'middle',

      '&:first-of-type': {
        paddingLeft: '36px',
        // ...(column.id === 'mrt-row-select' && { width: '100px', maxWidth: '100px' }),
      },

      '& .Mui-TableHeadCell-Content': {
        '& span.MuiBox-root': {
          display: 'none',
        },
      },

      '& .MuiTableSortLabel-root': {
        display: 'none',
      },
    }),
  }),
  muiTableBodyCellProps: ({ column }) => ({
    align: column.columnDef.align ?? 'left',
    sx: ({ colors }) => ({
      padding: '10px 16px',

      color: colors.primary,
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      cursor: 'default',
      overflow: column.columnDef.overflowDisabled ? 'unset' : 'hidden',

      borderBottom: `1px solid ${colors.dividerColor}`,

      '&:first-of-type': {
        paddingLeft: '36px',
        // ...(column.id === 'mrt-row-select' && { width: '100px', maxWidth: '100px' }),
      },

      '&:hover': {
        outline: 'none',
      },

      '&.Mui-TableBodyCell-DetailPanel': {
        padding: 0,
      },
    }),
  }),
  muiTableBodyRowProps: {
    sx: ({ colors }) => ({
      '&.Mui-selected': {
        backgroundColor: colors.white,
      },
      '&:hover .showOnRowHover': {
        display: 'flex !important',
      },
      '&:hover td': {
        backgroundColor: colors.tableRowHover,
        color: colors.linkColor,
      },

      '&.Mui-TableBodyCell-DetailPanel': {
        backgroundColor: colors.antiFlashWhite,
      },

      '&:not(.Mui-TableBodyCell-DetailPanel)': {
        height: '85px',
      },
    }),
  },
  muiSelectCheckboxProps: {
    disableRipple: true,
    sx: ({ colors }) => ({
      color: colors.primary,

      '&.Mui-checked': {
        color: colors.secondary,
      },
    }),
  },
  muiSelectAllCheckboxProps: {
    disableRipple: true,
    sx: ({ colors }) => ({
      color: colors.primary,

      '&.Mui-checked, &.MuiCheckbox-indeterminate': {
        color: colors.secondary,
      },
    }),
  },
};

const BaseTable = ({
  pinColumns = [],
  enableStickyHeader = true,
  getRowId = (row) => row.id,
  data,
  columns,
  title,
  hideEmptyTitle,
  emptyTableDescription,
  enableRowSelection,
  isLoading,
  tableInstanceRef,
  rowSelection,
  setRowSelection,
  sorting,
  setSorting,
  pagination,
  setPagination,
  selectedFilters,
  pinRowHoverActionColumns = [],
  pinSelectColumn,
  meta,
  enableEditing,
  enableColumnResizing,
  ...restProps
}) => {
  const NO_RESULT_FOUND_TEXT =
    'There are no results based on your current search and/or filters. Adjust your filters, and try again.';

  const [noResultsText, setNoResultsText] = useState(emptyTableDescription);

  useEffect(() => {
    if (
      data?.content?.length === 0 &&
      selectedFilters &&
      Object.keys(selectedFilters).some((key) => selectedFilters[key].value)
    ) {
      setNoResultsText(NO_RESULT_FOUND_TEXT);
    } else {
      setNoResultsText(emptyTableDescription);
    }
  }, [data, selectedFilters]);

  const pinnedCols = [...(pinSelectColumn ? ['mrt-row-select'] : []), ...pinColumns];

  return (
    <MaterialReactTable
      columns={columns}
      data={data?.content || []}
      enableStickyHeader={enableStickyHeader}
      enableRowSelection={enableRowSelection}
      renderTopToolbar={false}
      enableBottomToolbar={false}
      enableRowActions={false}
      enableColumnActions={false}
      enablePagination={false}
      enableColumnResizing={enableColumnResizing}
      manualPagination
      manualSorting
      tableInstanceRef={tableInstanceRef}
      onRowSelectionChange={setRowSelection}
      onPaginationChange={setPagination}
      state={{
        rowSelection,
        pagination,
        sorting,
        isLoading,
      }}
      onSortingChange={setSorting}
      getRowId={getRowId}
      meta={meta}
      renderEmptyRowsFallback={() => <EmptyTable title={title} hideTitle={hideEmptyTitle} message={noResultsText} />}
      enablePinning={!!pinnedCols?.length}
      initialState={{
        columnPinning: {
          left: pinnedCols,
          right: pinRowHoverActionColumns,
        },
      }}
      enableEditing={enableEditing}
      editingMode="cell"
      rowCount={data?.totalElements ?? 0}
      {...ComponentsConfiguration}
      {...restProps}
    />
  );
};

BaseTable.propTypes = {
  ...MaterialReactTable.propTypes,
};

export default BaseTable;
