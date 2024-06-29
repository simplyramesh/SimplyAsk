import { useFormik } from 'formik';
import { useState } from 'react';
import { Portal } from 'react-portal';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES } from '../../../utils/initialValueHelpers';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  closeMenuOnSelect: true,
  hideSelectedOptions: false,
  isClearable: true,
  openMenuOnClick: true,
};

const ScheduledProcessesFilters = ({
  customActionsRef,
  initialValues = {},
  onApplyFilters,
  executionNameOptions = [],
  isLoading,
}) => {
  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters?.(val);
      meta.resetForm(initialValues);
    },
  });

  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({ createdDate: false });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  if (isLoading) return <Spinner fadeBgParent medium />;

  return (
    <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => setValues(SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES)}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        <CustomSelect
          name="executionName"
          options={executionNameOptions}
          value={values.executionName}
          onChange={handleDropdownFilterChange}
          placeholder="Search Group Name..."
          components={{
            Option: CustomCheckboxOption,
          }}
          {...sharedDropdownProps}
          isSearchable
          withSeparator
        />

        <CustomSelect
          name="nextExecutionDate"
          value={values.nextExecutionDate}
          onChange={handleDropdownFilterChange}
          placeholder="Next Execution Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          radioLabels={[
            {
              label: 'Next Execution',
              value: ['nextExecutionBefore', 'nextExecutionAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
          isFutureCalendar
        />

        <CustomSelect
          name="lastExecutionDate"
          value={values.lastExecutionDate}
          onChange={handleDropdownFilterChange}
          placeholder="Last Execution Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          radioLabels={[
            {
              label: 'Last Execution',
              value: ['lastExecutionBefore', 'lastExecutionAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
        />

        <CustomSelect
          name="createdDate"
          value={values.createdDate}
          onChange={handleDropdownFilterChange}
          placeholder="Created On"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          radioLabels={[
            {
              label: 'Created On',
              value: ['createdBefore', 'createdAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
          withTimeRange
          maxMenuHeight={650}
          onMenuInputFocus={(v) => setIsCalendarMenuFocused({ createdDate: v })}
          {...{
            menuIsOpen: isCalendarMenuFocused.createdDate || undefined,
            isFocused: isCalendarMenuFocused.createdDate || undefined,
          }}
          onBlur={() => setIsCalendarMenuFocused({ createdDate: false })}
        />

      </StyledFlex>
      <Portal node={customActionsRef?.current}>
        <StyledButton
          width="125px"
          onClick={submitForm}
          variant="contained"
          primary
        >
          Confirm
        </StyledButton>
      </Portal>
    </StyledFlex>
  );
};

export default ScheduledProcessesFilters;
