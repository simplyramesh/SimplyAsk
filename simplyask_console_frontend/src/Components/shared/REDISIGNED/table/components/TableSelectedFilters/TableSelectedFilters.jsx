import React, { Fragment } from 'react';

import { StyledFlex } from '../../../../styles/styled';
import { StyledButton } from '../../../controls/Button/StyledButton';
import TableFilterBadge from '../TableFilterBadge/TableFilterBadge';

const TableSelectedFilters = ({ selectedFilters, onClearFilterField, onClearAll, isOneCategory = false }) => {
  const filterKeys = Object.keys(selectedFilters);
  const hasSomeFiltersSelected = filterKeys.some((k) => {
    const value = selectedFilters[k]?.value;

    return Array.isArray(value) ? !!value.length : !!value;
  });

  if (!hasSomeFiltersSelected) return null;

  // render in case if some filters selected
  return (
    <StyledFlex
      direction="row"
      alignItems="center"
      gap={isOneCategory ? '24px' : '14px'}
      flexWrap="wrap"
      margin={isOneCategory ? '20px 0 10px 0' : 0}
    >
      {onClearAll && (
        <StyledButton variant="text" onClick={onClearAll}>
          Clear All Filters
        </StyledButton>
      )}
      {filterKeys.map((key) => {
        const filterName = selectedFilters[key].label;
        const filterValue = selectedFilters[key].value;
        return (
          filterValue && (
            <Fragment key={key}>
              <TableFilterBadge
                key={key}
                onRemove={(value) => onClearFilterField(key, value)}
                filterName={filterName}
                filterValue={filterValue}
                filterKey={key}
                isOneCategory={isOneCategory}
              />
            </Fragment>
          )
        );
      })}
    </StyledFlex>
  );
};

export default TableSelectedFilters;
