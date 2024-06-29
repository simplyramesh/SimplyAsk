import PropTypes from 'prop-types';

import CustomCalendarIndicator from '../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomValueContainer from '../../../Settings/AccessManagement/components/dropdowns/customComponents/ValueContainer/CustomValueContainer';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { STATUS_MAP } from '../../utils/mappers';

const dropdownValue = (options, filterValue, { filterKey, optionKey }) => {
  if (Array.isArray(filterValue[filterKey])) {
    return options.filter((o) => filterValue[filterKey].includes(o[optionKey]));
  }

  return options.find((o) => o[optionKey] === filterValue[filterKey]);
};

const selectDropdownOption = (option, optionKey) => {
  if (Array.isArray(option)) {
    const options = option.map((o) => o[optionKey]);
    return options;
  }

  return option[optionKey];
};

const MrHistoryFilters = (props) => {
  const {
    filterValue,
    filterInputProps,
    onFilterChange,
    onClearFilters,
    executionIdOptions,
    onCalendarFilterChange,
    calendarKey,
  } = props;

  const statuses = Object.keys(STATUS_MAP).map((s) => ({
    label: STATUS_MAP[s].label,
    color: STATUS_MAP[s].color,
    value: s,
    status: s,
  }));

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton variant="text" onClick={onClearFilters}>Clear All Filters</StyledButton>
      </StyledFlex>
      <StyledFlex w="100%">
        <CustomSelect
          options={executionIdOptions}
          placeholder="Search Execution ID"
          {...filterInputProps('ids')}
          value={dropdownValue(executionIdOptions, filterValue, { filterKey: 'ids', optionKey: 'id' })}
          onChange={(option, action) => onFilterChange(action.name, selectDropdownOption(option, 'id'))}
          getOptionLabel={(option) => option.id}
          getOptionValue={(option) => option.id}
          withSeparator
          withMultiSelect
          isSearchable
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          hideMultiValueRemove
          isMulti
          isClearable={false}
          maxMenuHeight={416}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
            ValueContainer: CustomValueContainer,
          }}
        />
        <CustomSelect
          name="dateRange"
          placeholder="Select Date Range"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          {...filterInputProps(calendarKey)}
          onChange={onCalendarFilterChange}
          isDateModified
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          radioLabels={[
            {
              label: 'Started Date',
              value: ['createdBefore', 'createdAfter'],
              default: true,
            },
          ]}
        />
        <CustomSelect
          options={statuses}
          {...filterInputProps('statuses')}
          value={dropdownValue(statuses, filterValue, { filterKey: 'statuses', optionKey: 'value' })}
          onChange={(option, action) => onFilterChange(action.name, selectDropdownOption(option, 'value'))}
          placeholder="Select statuses"
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          isClearable={false}
          isSearchable={false}
          hideMultiValueRemove
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
            ValueContainer: CustomValueContainer,
          }}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default MrHistoryFilters;

MrHistoryFilters.propTypes = {
  filterValue: PropTypes.object,
  onClearFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
  filterInputProps: PropTypes.func,
  executionIdOptions: PropTypes.oneOfType([PropTypes.array, PropTypes.arrayOf(PropTypes.object)]),
};
