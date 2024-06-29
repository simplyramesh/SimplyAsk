import MaterialReactTable from 'material-react-table';
import PropTypes from 'prop-types';

import { tableStyles } from './tableStyles';

const BaseTable = ({
  columns, data, tableRef, manualFiltering, manualPagination, manualSorting, ...rest
}) => {
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        tableInstanceRef={tableRef}
        enableStickyHeader
        muiTablePaginationProps={{
          rowsPerPageOptions: [10],
          showFirstButton: false,
          showLastButton: false,
        }}
        muiTableProps={{
          sx: {
            tableLayout: 'fixed',
          },
        }}
        renderTopToolbar={false}
        enableRowActions={false}
        positionActionsColumn="last"
        positionGlobalFilter="left"
        enableColumnActions={false}
        manualPagination={manualPagination}
        manualSorting={manualSorting}
        manualFiltering={manualFiltering}
        {...tableStyles}
        {...rest}
        // muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
      />
    </>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.arrayOf(PropTypes.object),
  tableRef: PropTypes.object,
  ...MaterialReactTable.propTypes,
};

export default BaseTable;
