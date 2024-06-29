import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';

import { StyledFlex } from '../../styles/styled';

import BaseTable from './BaseTable/BaseTable';
import HeaderCell from './TableCells/HeaderCell/HeaderCell';
import TableFooter from './TableFooter/TableFooter';
import TableHeader from './TableHeader/TableHeader';

export const DEFAULT_PAGINATION = {
  pageSize: 25,
  pageIndex: 0,
};

const TableV2 = React.memo(
  ({
    data,
    columns = [],
    title,
    titleDescription,
    entityName,
    enableHeader = true,
    enableSearch,
    enableShowFiltersButton,
    searchPlaceholder,
    searchWidth,
    onSearch,
    initialSearchText,
    onShowFilters,
    quickFilters,
    selectedFilters,
    selectBarActions,
    onClearAllFilters,
    onClearFilter,
    headerActions,
    headerActionsPosition,
    enableFooter = true,
    footerTemplate,
    pagination = DEFAULT_PAGINATION,
    setPagination,
    sorting,
    setSorting,
    isLoading,
    enableRowSelection = true,
    enableSelectedToolbar = true,
    enablePageSizeChange = false,
    rowsPerPageOptions,
    onSelectionChange,
    enableStickyHeader,
    enableColumnResizing = true,
    getRowId = (row) => row?.id,
    hideEmptyTitle,
    emptyTableDescription,
    emptyTableTitle,
    isEmbedded,
    pinColumns = [],
    pinRowHoverActionColumns,
    pinSelectColumn,
    meta,
    tableRef = null,
    enableEditing,
    tableProps,
    selectionRefreshTrigger,
    rootHeight = 'auto',
    onTableRefresh,
    isRefreshAfterAction,
  }) => {
    const { colors, boxShadows } = useTheme();
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [columnsModel, setColumnsModel] = useState([]);

    useEffect(() => {
      if (selectionRefreshTrigger) {
        setRowSelection({});
      }
    }, [selectionRefreshTrigger]);

    useEffect(() => {
      if (columns?.length) {
        setColumnsModel(
          columns.map((column) => ({
            ...column,
            Header: column.Header ?? ((props) => <HeaderCell {...props} />),
          }))
        );
      }
    }, [columns]);

    useEffect(() => {
      onSelectionChange && onSelectionChange(Object.keys(rowSelection));
    }, [rowSelection]);

    return (
      <StyledFlex
        flex={1}
        maxHeight="100%"
        bgcolor={colors.white}
        borderRadius={isEmbedded ? '25px' : 0}
        boxShadow={isEmbedded ? boxShadows.table : 'none'}
        overflow="hidden"
        height={rootHeight}
      >
        {enableHeader && (
          <TableHeader
            title={title}
            titleDescription={titleDescription}
            entityName={entityName}
            enableSearch={enableSearch}
            enableSelectedToolbar={enableSelectedToolbar && enableRowSelection}
            enableShowFiltersButton={enableShowFiltersButton}
            searchPlaceholder={searchPlaceholder}
            searchWidth={searchWidth}
            onSearch={onSearch}
            initialSearchText={initialSearchText}
            onShowFilters={onShowFilters}
            selectedFilters={selectedFilters}
            onClearAllFilters={onClearAllFilters}
            onClearFilter={onClearFilter}
            headerActions={headerActions}
            headerActionsPosition={headerActionsPosition}
            quickFilters={quickFilters}
            selectBarActions={selectBarActions}
            tableInstanceRef={tableRef || tableInstanceRef}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data}
            getRowId={getRowId}
            onTableRefresh={onTableRefresh}
            isTableLoading={isLoading}
            isRefreshAfterAction={isRefreshAfterAction}
          />
        )}
        <StyledFlex overflow="hidden" height="100%" position="relative">
          <BaseTable
            data={data}
            columns={columnsModel}
            title={emptyTableTitle || entityName || title}
            hideEmptyTitle={hideEmptyTitle}
            emptyTableDescription={emptyTableDescription}
            enableRowSelection={enableRowSelection}
            enableStickyHeader={enableStickyHeader}
            enableColumnResizing={enableColumnResizing}
            isLoading={isLoading}
            tableInstanceRef={tableRef || tableInstanceRef}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            pagination={pagination}
            setPagination={setPagination}
            selectedFilters={selectedFilters}
            sorting={sorting}
            setSorting={setSorting}
            getRowId={getRowId}
            pinColumns={pinColumns}
            pinRowHoverActionColumns={pinRowHoverActionColumns}
            pinSelectColumn={pinSelectColumn}
            enableEditing={enableEditing}
            meta={meta}
            enableSortingRemoval={false}
            {...tableProps}
          />
        </StyledFlex>
        {footerTemplate}
        {enableFooter && (
          <StyledFlex mt="auto">
            <TableFooter
              pagination={pagination}
              setPagination={setPagination}
              data={data}
              entityName={entityName || title}
              enablePageSizeChange={enablePageSizeChange}
              rowsPerPageOptions={rowsPerPageOptions}
            />
          </StyledFlex>
        )}
      </StyledFlex>
    );
  }
);

export default TableV2;
