import { memo } from 'react';

import { StyledFlex } from '../../../styles/styled';
import { Pagination } from '../../table/components/TablePagination/TablePagination';
import TableFooterPages from './TableFooterPages/TableFooterPages';

const TableFooter = ({
  data, entityName, setPagination, enablePageSizeChange, rowsPerPageOptions, pagination,
}) => {

  const total = data?.totalElements || 0;
  const pageSize = data?.pageable?.pageSize;
  const pageCount = data?.totalPages || 0;
  const start = total > 0 ? (pagination.pageIndex * pagination.pageSize) + 1 : 0;
  const end = Math.min(start + pagination.pageSize - 1, total);

  return (
    <StyledFlex
      height="76px"
      position="relative"
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      padding="22px 36px"
      boxShadow="1px 1px 10px 2px rgba(0, 0, 0, 0.15)"
    >
      <StyledFlex direction="row">
        <TableFooterPages
          enablePageSizeChange={enablePageSizeChange}
          start={start}
          end={end}
          total={total}
          entityName={entityName}
          pageSize={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageSizeChange={(pageSize) => {
            setPagination((prev) => ({
              ...prev,
              pageSize,
            }));
          }}
        />
      </StyledFlex>
      {pageCount > 1 && (
        <Pagination
          onChange={(_, index) => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: index - 1,
            }));
          }}
          count={pageCount}
          page={pagination.pageIndex + 1}
          siblingCount={1}
          boundaryCount={1}
          defaultPage={0}
        />
      )}
    </StyledFlex>
  );
};

export default memo(TableFooter);
