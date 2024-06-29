import { useTheme } from '@mui/material/styles';

import CustomDropdownIndicator from '../../../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import SearchIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/SearchIcon';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { PRODUCT_ORDER_CUSTOMER_OPTION_LABEL_MAP, PRODUCT_ORDER_PLACEHOLDER_MAP, PRODUCT_SEARCH_BY_OPTIONS } from '../../../../../constants/productOptions';

const selectComponents = {
  IndicatorSeparator: () => null,
  DropdownIndicator: CustomDropdownIndicator,
};

const OrderCheckoutCustomerSearch = ({
  searchValue,
  onSearchValue,
  searchByValue,
  onSearchBy,
  onSearch,
  onAdvancedSearchOpen,
}) => {
  const { colors } = useTheme();

  const renderOptionLabel = (option, meta) => (
    meta.context === PRODUCT_ORDER_CUSTOMER_OPTION_LABEL_MAP.VALUE
      ? (
        <StyledText as="p" size={15} weight={600} lh={22} maxLines={1}>
          Search By:
          <StyledText display="inline" size={15} weight={400} lh={22}>{` ${option.label}`}</StyledText>
        </StyledText>
      )
      : <StyledText size={15} weight={400} lh={22}>{option.label}</StyledText>
  );

  return (
    <StyledFlex gap="15px">
      <StyledFlex direction="row" gap="15px" alignItems="center" flexWrap="wrap" width="100%">
        <StyledFlex flex="1 0 274px" minWidth="274px" maxHeight="36px">
          <CustomSelect
            options={PRODUCT_SEARCH_BY_OPTIONS}
            value={searchByValue}
            onChange={onSearchBy}
            components={selectComponents}
            formatOptionLabel={renderOptionLabel}
            menuPortalTarget={document.body}
            isSearchable={false}
            isMulti={false}
            closeMenuOnSelect
            placeholderFontSize={15}
            maxHeight={36}
            borderRadius="5px"
            padding="0 10px"
            borderColor={colors.black}
          />
        </StyledFlex>
        <StyledFlex
          as="form"
          flex="1 1 auto"
          minWidth="274px"
          onSubmit={(e) => {
            e.preventDefault();

            if (!searchValue) return;

            onSearch?.({ [searchByValue.value]: searchValue });
          }}
        >
          <BaseTextInput
            placeholder={PRODUCT_ORDER_PLACEHOLDER_MAP[searchByValue.value]}
            value={searchValue}
            onChange={onSearchValue}
            borderColor={colors.black}
            fontSize="15px"
            borderRadius="5px"
            inputHeight="36px"
          />
        </StyledFlex>
        <StyledFlex flex="1 1 auto">
          <StyledButton
            type="submit"
            variant="contained"
            primary
            startIcon={<SearchIcon />}
            minWidth="125px"
            onClick={() => onSearch?.({ [searchByValue.value]: searchValue })}
            disabled={!searchValue}
          >
            Search
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
      <StyledFlex alignItems="flex-start">
        <StyledButton
          variant="text"
          onClick={onAdvancedSearchOpen}
        >
          Advanced Search
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );
};

export default OrderCheckoutCustomerSearch;
