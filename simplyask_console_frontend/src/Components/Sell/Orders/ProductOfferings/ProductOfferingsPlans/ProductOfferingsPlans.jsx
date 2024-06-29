import { KeyboardArrowDown } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import FilterIcon from '../../../../shared/REDISIGNED/icons/svgIcons/FilterIcon';
import TableFilterBadge from '../../../../shared/REDISIGNED/table/components/TableFilterBadge/TableFilterBadge';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledProductsFilterSortButton } from '../../../StyledSellManagerContent';

const ProductOfferingsPlans = ({
  title,
  numOfResults = 0,
  children,
  isSortOpen = false,
  onSortOpen,
  sortOptionValue = 'Relevance',
  isFilterOpen = false,
  onFilterOpen,
  selectedFilters = [],
  onClearFilterField,
}) => {
  const { colors, boxShadows } = useTheme();

  return (
    <StyledFlex p="36px">
      <StyledFlex mb="56px">
        <StyledText as="h2" size={24} weight={700} lh={36}>{title}</StyledText>
      </StyledFlex>

      <StyledFlex
        direction="row"
        bgcolor={colors.bgColorOptionTwo}
        p="15px 20px"
        alignItems="center"
        alignSelf="stretch"
        borderRadius="8px"
        boxShadow={boxShadows.productPlanToolbar}
        mb="15px"
      >
        <StyledFlex direction="row" width="100%" alignItems="center">
          <StyledFlex direction="row" gap="0 20px" alignItems="center">
            <StyledText weight={500} lh={24}>{`${numOfResults} results`}</StyledText>
            <StyledText weight={500} lh={24}>|</StyledText>
          </StyledFlex>
          <StyledFlex direction="row" flex="1 0 0" gap="0 10px" alignItems="center">
            <StyledProductsFilterSortButton
              variant="text"
              color="primary"
              startIcon={<FilterIcon />}
              onClick={onFilterOpen}
              active={isFilterOpen}
            >
              <StyledText weight={600} lh={24}>Filters</StyledText>
            </StyledProductsFilterSortButton>
          </StyledFlex>
        </StyledFlex>
        <StyledFlex direction="row" alignItems="center" justifyContent="flex-end">
          <StyledText weight={600} lh={24} wrap="nowrap">Sort By:</StyledText>
          <StyledProductsFilterSortButton
            variant="text"
            color="primary"
            endIcon={<KeyboardArrowDown />}
            onClick={onSortOpen}
            active={isSortOpen}
          >
            {` ${sortOptionValue}`}
          </StyledProductsFilterSortButton>
        </StyledFlex>
      </StyledFlex>
      <StyledFlex direction="row" gap="15px" mb="30px">
        {selectedFilters.length > 0 && selectedFilters.map((filter) => (
          <TableFilterBadge
            key={filter.value}
            onRemove={() => onClearFilterField?.(filter.value)}
            filterName={filter.label}
            filterValue={filter.value}
          />
        ))}
      </StyledFlex>
      <StyledFlex direction="row" flexWrap="wrap" gap="32px 30px">
        {children}
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProductOfferingsPlans;
