import PropTypes from 'prop-types';
import { Fragment } from 'react';

import { StyledFlex } from '../../../../styles/styled';
import { StyledButton } from '../../../controls/Button/StyledButton';
import TableFilterBadge from '../TableFilterBadge/TableFilterBadge';

const getUpdatedFilters = (filterToRemove, filters) => Object.keys(filters).reduce((acc, filterKey) => {
  const filterValue = filters[filterKey];

  if (Array.isArray(filterValue)) {
    const updatedFilterValues = filterValue.filter((filterValue) => filterValue !== filterToRemove);
    const checkIfEmpty = updatedFilterValues.length === 0 ? null : updatedFilterValues;

    return checkIfEmpty ? { ...acc, [filterKey]: checkIfEmpty } : acc;
  }

  if (filterValue !== filterToRemove) return { ...acc, [filterKey]: filterValue };

  return acc;
}, {});

const PageableTableHeader = ({
  children,
  filters = {}, // DEPRECATED, please use selectedFiltersTemplate + TableSelectedFilters
  onRemove,
  onClearFilters,
  renderSelectedFilters,
}) => {
  const filterKeys = Object.keys(filters).filter((filterKey) => filterKey !== 'timezone');

  const handleRemove = (filterToRemove) => {
    const updatedFilters = getUpdatedFilters(filterToRemove, filters);

    onRemove(updatedFilters);
  };

  const renderTableFilterItem = (filterKey, filterValue) => (
    <TableFilterBadge
      key={filterValue}
      onRemove={() => handleRemove(filterValue)}
      filterName={filterKey}
      filterValue={filterValue}
    />
  );

  return (
    <StyledFlex alignItems="normal" rowGap="22px" margin="8px 0 32px 0" flex="1 1 auto">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" flex="1 1 auto">
        {children}
      </StyledFlex>
      {renderSelectedFilters}
      {filterKeys.length > 0 && (
        <StyledFlex direction="row" align="center" gap="14px" flex-wrap="flex-wrap">
          <StyledButton variant="text" onClick={onClearFilters}>Clear All Filters</StyledButton>
          {filterKeys.map((filterKey, index) => (
            <Fragment key={index}>
              {Array.isArray(filters[filterKey])
                ? (<>{filters[filterKey].map((filterValue) => (renderTableFilterItem(filterKey, filterValue)))}</>)
                : renderTableFilterItem(filterKey, filters[filterKey])}
            </Fragment>
          ))}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default PageableTableHeader;

PageableTableHeader.propTypes = {
  children: PropTypes.node,
  renderSelectedFilters: PropTypes.node,
  filters: PropTypes.object,
  onRemove: PropTypes.func,
  onClearFilters: PropTypes.func,
};
