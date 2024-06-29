import { useTheme } from '@emotion/react';
import { StyledFlex, StyledText } from '../../../../styles/styled';
import AccessManagementIcons from '../../../icons/CustomTableIcons';
import { StyledTableFilterBadge } from './StyledTableFilterBadge';

const FilterName = ({ name, value }) => (
  <StyledText as="p" size={16} weight={600} lh={24} capitalize>
    {name && `${name}: `}
    {value && (
      <StyledText as="span" display="inline" size={16} weight={400} lh={24}>
        {value}
      </StyledText>
    )}
  </StyledText>
);

const FilterBadge = ({ name, value, onRemove }) => {
  const { colors } = useTheme();

  return (
    <StyledTableFilterBadge>
      <FilterName name={name.label} value={name.value} />
      <AccessManagementIcons
        icon="CLOSE"
        width={14}
        color={colors.coolGray}
        colorHover={colors.primary}
        onClick={() => onRemove(value)}
      />
    </StyledTableFilterBadge>
  );
};

const TableFilterBadge = ({ filterName, filterValue, onRemove, isOneCategory }) => {
  const filterValues = [].concat(filterValue);

  const renderFilterBadge = (item) => {
    const nameLabel = isOneCategory ? null : filterName;
    const nameValue = isOneCategory ? item.label : item;
    const name = { label: nameLabel, value: nameValue };

    const value = isOneCategory ? item.value : item;

    return <FilterBadge key={value} name={name} value={value} onRemove={onRemove} />;
  };

  const filterBadges = filterValues.map(renderFilterBadge);

  return (
    <StyledFlex direction="row" alignItems="center" gap="10px">
      {isOneCategory ? (
        <>
          <FilterName name={filterName} />
          <StyledFlex direction="row" alignItems="center" gap="10px" flexWrap="wrap">
            {filterBadges}
          </StyledFlex>
        </>
      ) : (
        filterBadges
      )}
    </StyledFlex>
  );
};

export default TableFilterBadge;
