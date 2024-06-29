import PropTypes from 'prop-types';

import useManualTableFeatures from '../../../../hooks/useManualTableFeatures';
import { StyledFlex, StyledText } from '../../styles/styled';
import CustomTableIcons from '../icons/CustomTableIcons';
import BottomToolbar from '../table/components/BottomToolbar/BottomToolbar';
import NumberOfPages from '../table/components/TablePagination/paginationInfo/NumberOfPages';
import TablePagination from '../table/components/TablePagination/TablePagination';
import { StyledCardGridItem, StyledCardGridItemText } from './components/StyledCardGridItem';

const DEFAULT_PAGINATION = {
  PAGE_SIZE: 8,
  PAGE_NUMBER: 0,
};

const CardGrid = ({
  queryFn, queryKey, initFilters, queryParams, queryEnabled, displayFn, clickFn, tableName, emptyText,
}) => {
  const { data, setPagination } = useManualTableFeatures(
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

  return (
    <>
      <StyledFlex gap="26px" direction="row" flexWrap="wrap">
        {data?.content?.length ? data.content.map((item, i) => (
          <StyledCardGridItem
            key={i}
            alignItems="center"
            direction="row"
            flex="1 0 calc((100% - 26px) / 2)"
            onClick={() => clickFn?.(item)}
            noClick={!clickFn}
            noHover={!clickFn}
          >
            <StyledCardGridItemText>{ displayFn ? displayFn(item) : item }</StyledCardGridItemText>
          </StyledCardGridItem>
        )) : (
          <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
            <CustomTableIcons icon="EMPTY" width={88} />
            <StyledFlex width="408px" alignItems="center" justifyContent="center">
              <StyledText as="h3" size={18} weight={600} mb={10}>{`No ${tableName} Found`}</StyledText>
              <StyledText
                as="p"
                size={16}
                weight={400}
                lh={21}
                textAlign="center"
              >
                {emptyText}
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        )}
      </StyledFlex>

      { typeof data?.totalElements === 'number' && data.totalElements > 0
        ? (
          <BottomToolbar>
            <BottomToolbar.Left>
              <NumberOfPages
                tableDataName={tableName}
                start={data?.pageable?.offset + 1 || 0}
                end={data?.pageable?.offset + data?.numberOfElements || 0}
                total={data?.totalElements ?? 0}
              />
            </BottomToolbar.Left>
            <BottomToolbar.Right>
              <TablePagination
                count={data?.totalPages}
                page={data?.pageable?.pageNumber}
                onPageChange={(index) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: index,
                  }));
                }}
              />
            </BottomToolbar.Right>
          </BottomToolbar>
        ) : `Showing 0 ${tableName}` }
    </>
  );
};

export default CardGrid;

CardGrid.propTypes = {
  queryKey: PropTypes.string,
  queryFn: PropTypes.func,
  initFilters: PropTypes.object,
  queryEnabled: PropTypes.bool,
  queryParams: PropTypes.array,
  displayFn: PropTypes.func,
  clickFn: PropTypes.func,
  tableName: PropTypes.string,
  emptyText: PropTypes.string,
};
