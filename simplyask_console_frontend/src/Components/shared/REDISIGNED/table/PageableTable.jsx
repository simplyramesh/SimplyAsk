import PropTypes from 'prop-types';

import BaseTable from './components/BaseTable/BaseTable';
import TableFooter from './components/TableFooter/TableFooter';

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  PAGE_NUMBER: 0,
};

const paginationMeta = ({ isFetching, isLoading, data }) => {
  const isNoFetching = !isLoading || !isFetching;
  const offset = data?.pageable?.offset;

  return {
    pagination: {
      start: (isNoFetching && data?.numberOfElements && offset + 1) || 0,
      end: (isNoFetching && offset + data?.numberOfElements) || 0,
      total: data?.totalElements ?? 0,
    },
  };
};

const PageableTable = ({
  data,
  columns,
  meta,
  pagination = DEFAULT_PAGINATION,
  setPagination,
  setSorting,
  sorting,
  isFetching,
  isLoading,
  tableName,
  disableTableFooter,
  ...restTableProps
}) => {
  const items = data?.content ?? [];

  return (
    <BaseTable
      columns={columns}
      data={items}
      meta={{
        ...paginationMeta({ isLoading, isFetching, data }),
        ...meta,
      }}
      pageCount={data?.totalPages ?? 0}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={data?.totalElements ?? 0}
      state={{
        isFetching,
        isLoading,
        pagination,
        showProgressBars: isFetching,
        sorting,
      }}
      renderBottomToolbar={({ table }) => (disableTableFooter ? null : <TableFooter pagination={pagination} table={table} tableName={tableName} />)}
      memoMode="table-cell"
      manualSorting
      manualPagination
      manualFiltering
      {...restTableProps}
    />
  );
};

export default PageableTable;

PageableTable.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object),
  meta: PropTypes.object,
  pagination: PropTypes.object,
  setPagination: PropTypes.func,
  sorting: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      desc: PropTypes.bool,
    }),
  ),
  setSorting: PropTypes.func,
  isFetching: PropTypes.bool,
  isLoading: PropTypes.bool,
  tableName: PropTypes.string,
  disableTableFooter: PropTypes.bool,
};
