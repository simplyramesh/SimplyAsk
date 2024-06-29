import PropTypes from 'prop-types';
import { useEffect } from 'react';

import useManualTableFeatures from '../../../../hooks/useManualTableFeatures';
import BaseTable from './components/BaseTable/BaseTable';
import TableFooter from './components/TableFooter/TableFooter';
import { DEFAULT_PAGINATION } from '../../constants/core';

const paginationMeta = ({ isFetching, isLoading, data }) => {
  return {
    pagination: {
      start: ((!isLoading || !isFetching) && data?.pageable?.offset + 1) || 0,
      end: ((!isLoading || !isFetching) && data?.pageable?.offset + data?.numberOfElements) || 0,
      total: data?.totalElements ?? 0,
    },
  };
};

const CustomTable = ({
  columns, tableRef, meta, memoMode, queryKey, queryFn, initFilters, queryParams, queryEnabled, getTableFns, tableName, ...tableProps
}) => {
  const {
    data,
    isFetching,
    isLoading,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    onSearch,
    refetch,
  } = useManualTableFeatures(
    queryKey,
    queryFn,
    {
      ...initFilters,
      pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
      pageNumber: DEFAULT_PAGINATION.PAGE_NUMBER,
    },
    queryParams,
    queryEnabled,
  );

  useEffect(() => {
    getTableFns({
      data,
      columnFilters,
      setColumnFilters,
      onSearch,
      refetch,
    });
  }, [columnFilters, data]);

  return (
    <BaseTable
      columns={columns}
      data={data?.content ?? []}
      tableRef={tableRef}
      meta={{
        ...paginationMeta({ isLoading, isFetching, data }),
        ...meta,
      }}
      pageCount={data?.totalPages ?? 0}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={data?.totalElements ?? 0}
      state={{
        isLoading,
        pagination,
        showProgressBars: isFetching,
        sorting,
      }}
      renderBottomToolbar={({ table }) => <TableFooter table={table} tableName={tableName} />}
      memoMode={memoMode || 'table-body'}
      manualSorting
      manualPagination
      manualFiltering
      {...tableProps}
    />
  );
};

export default CustomTable;

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  meta: PropTypes.object,
  tableRef: PropTypes.object,
  memoMode: PropTypes.string,
  queryKey: PropTypes.string,
  tableName: PropTypes.string,
  queryFn: PropTypes.func,
  initFilters: PropTypes.object,
  queryEnabled: PropTypes.bool,
  queryParams: PropTypes.array,
  getTableFns: PropTypes.func,
};
