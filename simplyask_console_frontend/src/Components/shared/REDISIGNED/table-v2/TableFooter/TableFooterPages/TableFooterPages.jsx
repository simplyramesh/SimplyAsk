import { memo } from 'react';

import { StyledFlex, StyledText } from '../../../../styles/styled';
import { DEFAULT_ROWS_PER_PAGE_OPTIONS } from '../../../table/constants/tableConstants';
import { StyledRowPerPageDropdown, StyledRowsPerPageItem, StyledRowsPerPageMenu } from '../StyledTableFooter';

const TableFooterPages = ({
  start,
  end,
  total,
  entityName,
  enablePageSizeChange,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  pageSize = 25,
  onPageSizeChange,
}) => {
  const getPageStats = () => total > 1 ? `${start} - ${end} of ${total} ${entityName}` : `${start} of ${total} ${entityName}`;
  const RowsPerPage = ({ pageSize, onPageSizeChange, rowsPerPageOptions }) => (
    <StyledFlex direction="row" ml="12px" mr="12px">
      <StyledRowPerPageDropdown
        autoWidth
        MenuProps={{
          component: StyledRowsPerPageMenu,
        }}
        value={pageSize}
        onChange={(e) => onPageSizeChange(e.target.value, e)}
      >
        {rowsPerPageOptions?.map((option) => (
          <StyledRowsPerPageItem key={option.value} value={option.value}>
            {option.label}
          </StyledRowsPerPageItem>
        ))}
      </StyledRowPerPageDropdown>
    </StyledFlex>
  );

  return (
    <StyledFlex direction="row" alignItems="center" >
      { enablePageSizeChange
        ? (<>
          <StyledText size={14} lh={17}>Show</StyledText>
          <RowsPerPage pageSize={pageSize} onPageSizeChange={onPageSizeChange} rowsPerPageOptions={rowsPerPageOptions}/>
          <StyledText size={14} lh={17}>
            {getPageStats()}
          </StyledText>
        </>)
        : <StyledText size={14} lh={17}>Showing {getPageStats()}</StyledText>}

    </StyledFlex>
  );
};

export default memo(TableFooterPages);
