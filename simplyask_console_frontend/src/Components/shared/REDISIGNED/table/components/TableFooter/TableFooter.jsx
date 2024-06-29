import PropTypes from 'prop-types';

import BottomToolbar from '../BottomToolbar/BottomToolbar';
import NumberOfPages from '../TablePagination/paginationInfo/NumberOfPages';
import TablePagination from '../TablePagination/TablePagination';

const TableFooter = ({ table, tableName, pagination }) => {
  const start = table?.options.meta.pagination?.start;
  const end = table?.options.meta.pagination?.end;
  const total = table?.options.meta.pagination?.total;

  return (
    <BottomToolbar>
      <BottomToolbar.Left>
        <NumberOfPages start={start} end={end} total={total} tableDataName={tableName} />
      </BottomToolbar.Left>
      <BottomToolbar.Right>
        {table.options.pageCount > 1 && (
          <TablePagination count={table.getPageCount()} page={pagination.pageIndex} onPageChange={table.setPageIndex} />
        )}
      </BottomToolbar.Right>
    </BottomToolbar>
  );
};

export default TableFooter;

TableFooter.propTypes = {
  table: PropTypes.object,
  tableName: PropTypes.string,
};
