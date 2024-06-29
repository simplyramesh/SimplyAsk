import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledDivider, StyledFlex } from '../../../../styles/styled';
import AdditionalActionButton
  from '../AdditionalActionButton/AdditionalActionButton';
import TableFilterBadge from '../TableFilterBadge/TableFilterBadge';

const TableHeader = ({
  enhancedHeaderComponentsBeforeDivider,
  enhancedHeaderComponentsAfterDivider,
  enhancedHeaderTitle,
  headerComponents,
  onClearFilters,
  showFilters,
  filterList,
  onRemove,
}) => {
  const theme = useTheme();

  const handleRemove = (index) => {
    const newFilterList = filterList.filter((_, i) => i !== index);

    onRemove(newFilterList);
  };

  return (
    <StyledFlex
      alignItems="normal"
      rowGap="22px"
      margin="0 0 32px 0"
      flex="1 1 auto"
    >
      {enhancedHeaderComponentsBeforeDivider?.length && (
        <>
          {enhancedHeaderTitle && (
            <StyledFlex direction="row">
              {enhancedHeaderTitle}
            </StyledFlex>
          )}
          <StyledFlex direction="row" alignItems="center" gap="44px">
            <StyledFlex direction="row" alignItems="center" gap="14px">
              {enhancedHeaderComponentsBeforeDivider.map((component) => component)}
            </StyledFlex>
            {enhancedHeaderComponentsAfterDivider?.length && (
              <>
                <StyledDivider orientation="vertical" flexItem />
                <StyledFlex direction="row">
                  {enhancedHeaderComponentsAfterDivider.map((component) => component)}
                </StyledFlex>
              </>
            )}
          </StyledFlex>
          <StyledDivider color={theme.colors.primary} />
        </>
      )}
      <StyledFlex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flex="1 1 auto"
      >
        {headerComponents?.length && headerComponents.map((component) => component)}
      </StyledFlex>
      {showFilters && filterList?.length > 0 && (
        <StyledFlex
          direction="row"
          align="center"
          gap="14px"
          flex-wrap="flex-wrap"
        >
          <AdditionalActionButton onClick={onClearFilters} text="Clear All Filters" />
          {filterList.map(({ filterName, filterValue }, index) => (
            <TableFilterBadge
              onRemove={() => handleRemove(index)}
              filterName={filterName}
              filterValue={filterValue}
              key={filterValue}
            />
          ))}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default TableHeader;

TableHeader.propTypes = {
  enhancedHeaderComponentsBeforeDivider: PropTypes.array,
  enhancedHeaderComponentsAfterDivider: PropTypes.array,
  filterList: PropTypes.arrayOf(PropTypes.shape({
    filterName: PropTypes.string,
    filterValue: PropTypes.string,
  })),
  enhancedHeaderTitle: PropTypes.any,
  headerComponents: PropTypes.array,
  showFilters: PropTypes.bool,
  onClearFilters: PropTypes.func,
  onRemove: PropTypes.func,
};
