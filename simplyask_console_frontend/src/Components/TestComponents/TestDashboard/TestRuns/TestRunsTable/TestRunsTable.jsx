import MaterialReactTable from 'material-react-table';
import { useRef } from 'react';

import { displayTableStyles } from './testRunTableStyles';

const TestRunsTable = ({
  columns, data = [], meta, ...props
}) => {
  const tableRef = useRef(null);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      tableInstanceRef={tableRef}
      enableSorting={false}
      // Expand props
      initialState={{ expanded: true }}
      enableExpanding={false} // required so that expand display column is not shown
      enableExpandAll={false}
      filterFromLeafRows
      getSubRows={(row) => row.testRunCases}
      paginateExpandedRows={false}
      // Editable props
      editingMode="cell"
      enableEditing
      meta={meta}
      {...props}
      {...displayTableStyles}
    />
  );
};

export default TestRunsTable;

TestRunsTable.propTypes = MaterialReactTable.propTypes;
