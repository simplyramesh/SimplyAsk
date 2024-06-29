import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import SearchBar from '../../../SearchBar/SearchBar';
import ViewFiltersButton from '../../../ViewFiltersButton/ViewFiltersButton';
import { StyledFlex, StyledIconButton, StyledText } from '../../../styles/styled';
import RefreshIcon from '../../icons/svgIcons/RefreshIcon';
import TableSelectedFilters from '../../table/components/TableSelectedFilters/TableSelectedFilters';
import { StyledTooltip } from '../../tooltip/StyledTooltip';
import TableSelectedToolbar from '../TableSelectedToolbar/TableSelectedToolbar';

export const HEADER_ACTIONS_POSITION = {
  TITLE_BAR: 'TITLE_BAR',
  ACTION_BAR: 'ACTION_BAR',
};

const TableHeader = ({
  title,
  titleDescription,
  entityName,
  enableSearch = true,
  enableShowFiltersButton = true,
  enableSelectedToolbar = false,
  searchPlaceholder,
  searchWidth = '357px',
  headerActions,
  headerActionsPosition = HEADER_ACTIONS_POSITION.ACTION_BAR,
  quickFilters,
  onSearch,
  initialSearchText,
  onShowFilters,
  selectedFilters,
  onClearAllFilters,
  onClearFilter,
  rowSelection,
  setRowSelection,
  selectBarActions,
  data,
  getRowId,
  onTableRefresh,
  isTableLoading,
  isRefreshAfterAction = false,
}) => {
  const { colors } = useTheme();

  const [showSelectedToolbar, setShowSelectedToolbar] = useState(false);
  const showActionsInActionBar = !!headerActions && headerActionsPosition === HEADER_ACTIONS_POSITION.ACTION_BAR;
  const showActionsInTitleBar = !!headerActions && headerActionsPosition === HEADER_ACTIONS_POSITION.TITLE_BAR;
  const showActionBar = enableSearch || enableShowFiltersButton || showActionsInActionBar || quickFilters;

  useEffect(() => {
    const isShowSelectedToolbar = enableSelectedToolbar && Object.keys(rowSelection).length > 0;
    setShowSelectedToolbar(isShowSelectedToolbar);
  }, [rowSelection, enableSelectedToolbar]);

  const renderRefreshButton = (onRefresh, isLoading) =>
    onRefresh ? (
      <StyledTooltip title={isLoading ? '' : 'Refresh Table Data'} arrow placement="top" p="15px" maxWidth="165px">
        <StyledFlex ml="9px">
          <StyledIconButton
            bgColor={colors.white}
            hoverBgColor={colors.tableEditableCellBg}
            size="40px"
            onClick={() => onRefresh?.()}
            disabled={isLoading}
          >
            <RefreshIcon />
          </StyledIconButton>
        </StyledFlex>
      </StyledTooltip>
    ) : null;

  return (
    <StyledFlex p="30px 36px" gap={2.5}>
      {(title || titleDescription) && (
        <StyledFlex direction="row" alignItems="center">
          <StyledFlex gap={0.25}>
            <StyledText size={19} lh={28} weight={600}>
              {title}
            </StyledText>
            <StyledText>{titleDescription}</StyledText>
          </StyledFlex>
          {showActionsInTitleBar && <StyledFlex ml="auto">{headerActions}</StyledFlex>}
        </StyledFlex>
      )}
      {showSelectedToolbar ? (
        <TableSelectedToolbar
          title={entityName || title}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          data={data}
          getRowId={getRowId}
          selectedFilters={selectedFilters}
          selectBarActions={selectBarActions}
        />
      ) : (
        showActionBar && (
          <StyledFlex gap={1.25}>
            <StyledFlex direction="row" justifyContent="space-between" alignItems="center" minHeight="50px">
              <StyledFlex direction="row">
                <StyledFlex direction="row" alignItems="center" gap="16px">
                  {enableSearch && (
                    <SearchBar
                      placeholder={searchPlaceholder}
                      onChange={onSearch}
                      width={searchWidth}
                      initialSearchValue={initialSearchText}
                    />
                  )}
                  {quickFilters && <StyledFlex>{quickFilters}</StyledFlex>}
                  {enableShowFiltersButton && <ViewFiltersButton onClick={onShowFilters} />}
                </StyledFlex>
                {!isRefreshAfterAction && renderRefreshButton(onTableRefresh, isTableLoading)}
              </StyledFlex>
              {showActionsInActionBar && (
                <StyledFlex ml="auto" className="headerActionsContainer">
                  {headerActions}
                </StyledFlex>
              )}
              {isRefreshAfterAction && renderRefreshButton(onTableRefresh, isTableLoading)}
            </StyledFlex>

            {selectedFilters && (
              <TableSelectedFilters
                selectedFilters={selectedFilters}
                onClearAll={onClearAllFilters}
                onClearFilterField={onClearFilter}
              />
            )}
          </StyledFlex>
        )
      )}
    </StyledFlex>
  );
};

export default TableHeader;
