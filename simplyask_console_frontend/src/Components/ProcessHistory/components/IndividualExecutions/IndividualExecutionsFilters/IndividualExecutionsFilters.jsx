import { useFormik } from 'formik';
import { useState } from 'react';
import { Portal } from 'react-portal';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteFilter } from '../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import {
  PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES,
  PROCESS_EXECUTIONS_STATUS_OPTIONS,
  PROCESS_EXECUTION_FILTERS,
  sharedDropdownProps,
} from '../../../constants/core';
import { configuredExecutionFilterOptions } from '../../../utils/helpers';

const IndividualExecutionsFilters = ({ sidebarActionsRef, onApplyFilters, initialValues, currentProcesses }) => {
  const filterOptions = configuredExecutionFilterOptions(currentProcesses);

  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({
    [PROCESS_EXECUTION_FILTERS.END_TIME]: false,
    [PROCESS_EXECUTION_FILTERS.START_TIME]: false,
  });

  const { values, setFieldValue, submitForm, setValues } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <StyledButton variant="text" onClick={() => setValues(PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES)}>
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        <CustomSelect
          name={PROCESS_EXECUTION_FILTERS.STATUS}
          options={PROCESS_EXECUTIONS_STATUS_OPTIONS}
          value={values[PROCESS_EXECUTION_FILTERS.STATUS]}
          onChange={handleDropdownFilterChange}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          placeholder="Select Status"
          isMulti
          {...sharedDropdownProps}
          isClearable
        />
        <CustomSelect
          name={PROCESS_EXECUTION_FILTERS.ENVIRONMENTS}
          options={filterOptions[PROCESS_EXECUTION_FILTERS.ENVIRONMENTS] || []}
          value={values[PROCESS_EXECUTION_FILTERS.ENVIRONMENTS]}
          onChange={handleDropdownFilterChange}
          placeholder="Search Environments..."
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          minHeight={40}
          menuPadding={0}
          noOptionsMessage={() => 'No Environments found'}
          withSeparator
          isSearchable
          isMulti
          closeMenuOnScroll
        />
        <CustomSelect
          name={PROCESS_EXECUTION_FILTERS.START_TIME}
          value={values[PROCESS_EXECUTION_FILTERS.START_TIME]}
          onChange={handleDropdownFilterChange}
          placeholder="Select Start Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          {...sharedDropdownProps}
          isSearchable={false}
          radioLabels={[
            {
              label: 'Start Date',
              value: [PROCESS_EXECUTION_FILTERS.STARTED_BEFORE, PROCESS_EXECUTION_FILTERS.STARTED_AFTER],
              default: true,
            },
          ]}
          showDateFilterType
          onMenuInputFocus={(v) =>
            setIsCalendarMenuFocused({
              [PROCESS_EXECUTION_FILTERS.END_TIME]: v,
              [PROCESS_EXECUTION_FILTERS.START_TIME]: false,
            })
          }
          {...{
            menuIsOpen: isCalendarMenuFocused[PROCESS_EXECUTION_FILTERS.START_TIME] || undefined,
            isFocused: isCalendarMenuFocused[PROCESS_EXECUTION_FILTERS.START_TIME] || undefined,
          }}
          onBlur={() =>
            setIsCalendarMenuFocused({
              [PROCESS_EXECUTION_FILTERS.END_TIME]: false,
              [PROCESS_EXECUTION_FILTERS.START_TIME]: false,
            })
          }
          withTimeRange
        />
        <CustomSelect
          name={PROCESS_EXECUTION_FILTERS.END_TIME}
          value={values[PROCESS_EXECUTION_FILTERS.END_TIME]}
          onChange={handleDropdownFilterChange}
          placeholder="Select End Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          {...sharedDropdownProps}
          isSearchable={false}
          radioLabels={[
            {
              label: 'End Date',
              value: [PROCESS_EXECUTION_FILTERS.ENDED_BEFORE, PROCESS_EXECUTION_FILTERS.ENDED_AFTER],
              default: true,
            },
          ]}
          showDateFilterType={false}
          onMenuInputFocus={(v) =>
            setIsCalendarMenuFocused({
              [PROCESS_EXECUTION_FILTERS.END_TIME]: v,
              [PROCESS_EXECUTION_FILTERS.START_TIME]: false,
            })
          }
          {...{
            menuIsOpen: isCalendarMenuFocused[PROCESS_EXECUTION_FILTERS.END_TIME] || undefined,
            isFocused: isCalendarMenuFocused[PROCESS_EXECUTION_FILTERS.END_TIME] || undefined,
          }}
          onBlur={() =>
            setIsCalendarMenuFocused({
              [PROCESS_EXECUTION_FILTERS.END_TIME]: false,
              [PROCESS_EXECUTION_FILTERS.START_TIME]: false,
            })
          }
          withTimeRange
        />
        <CustomSelect
          options={filterOptions[PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS] || []}
          name={PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS}
          value={values[PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS]}
          onChange={handleDropdownFilterChange}
          placeholder="Select Trigger Method"
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          minHeight={40}
          menuPadding={0}
          noOptionsMessage={() => 'No Trigger Methods found'}
          {...sharedDropdownProps}
          isMulti
          isSearchable={false}
        />
        <UserAutocompleteFilter
          name={PROCESS_EXECUTION_FILTERS.TRIGGER_BY}
          placeholder="Search Triggered By..."
          value={values[PROCESS_EXECUTION_FILTERS.TRIGGER_BY]}
          onChange={handleDropdownFilterChange}
          isMulti
          isClearable={false}
        />
      </StyledFlex>
      <Portal node={sidebarActionsRef?.current}>
        <StyledButton primary variant="contained" onClick={submitForm}>
          Confirm
        </StyledButton>
      </Portal>
    </StyledFlex>
  );
};

export default IndividualExecutionsFilters;
