import React, { useState } from 'react';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomCalendarIndicator from '../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import { sharedDropdownProps } from '../../../Issues/constants/options';
import { useFormik } from 'formik';
import NoOptionsMessage from '../../../Sell/shared/NoOptionsMessage';
import LoadingMessage from '../../../Sell/shared/LoadingMessage';
import { EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES, EVENT_TRIGGER_FILTER_KEYS } from './constants';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { Portal } from 'react-portal';
import CustomCheckboxOption from '../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import Spinner from '../../../shared/Spinner/Spinner';
import { debounce } from 'lodash';
import { getEnvironments } from '../../../../Services/axios/environment';
import { debouncedEnvironmentSearchFn } from './helper';

const EventTriggersFilters = ({
  initialValues = {},
  onApplyFilters,
  processDefinitionOptions = [],
  customActionsRef,
  isLoading,
  environmentOptions,
}) => {
  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({ dueDate: false, createdDate: false });

  const { values, setFieldValue, submitForm, setValues } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <>
      <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
        {isLoading && <Spinner fadeBgParent medium />}
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
          <StyledText size={18} weight={500}>
            Filter By
          </StyledText>
          <StyledButton variant="text" onClick={() => setValues(EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES)}>
            Clear All Filters
          </StyledButton>
        </StyledFlex>
        <StyledFlex>
          <StyledFlex mb="16px">
            <CustomSelect
              name={EVENT_TRIGGER_FILTER_KEYS.WORKFLOWS_in_USE}
              placeholder="Select a Process..."
              options={processDefinitionOptions}
              value={values[EVENT_TRIGGER_FILTER_KEYS.WORKFLOWS_in_USE]}
              closeMenuOnSelect
              closeMenuOnScroll
              onChange={handleDropdownFilterChange}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPlacement="auto"
              withSeparator
              isSearchable
            />

            <CustomSelect
              name={EVENT_TRIGGER_FILTER_KEYS.ENVIRONMENT_IDS}
              value={values[EVENT_TRIGGER_FILTER_KEYS.ENVIRONMENT_IDS]}
              onChange={handleDropdownFilterChange}
              placeholder="Select Environments..."
              defaultOptions={environmentOptions || []}
              isAsync
              loadOptions={debouncedEnvironmentSearchFn}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
                NoOptionsMessage,
                LoadingMessage,
              }}
              isSearchable
              isMulti
              withSeparator
              {...sharedDropdownProps}
              isClearable={true}
            />

            <CustomSelect
              name={EVENT_TRIGGER_FILTER_KEYS.UPDATED_AT}
              value={values[EVENT_TRIGGER_FILTER_KEYS.UPDATED_AT]}
              onChange={handleDropdownFilterChange}
              placeholder="Select Last Updated Date"
              components={{
                DropdownIndicator: CustomCalendarIndicator,
                Menu: CustomCalendarMenu,
              }}
              isSearchable={false}
              {...sharedDropdownProps}
              radioLabels={[
                {
                  label: 'Updated Date',
                  value: ['updatedBefore', 'updatedAfter'],
                  default: true,
                },
              ]}
              showDateFilterType={false}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ dueDate: v, createdDate: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.dueDate || undefined,
                isFocused: isCalendarMenuFocused.dueDate || undefined,
              }}
              onBlur={() => setIsCalendarMenuFocused({ dueDate: false, createdDate: false })}
              withTimeRange
            />
            <CustomSelect
              name={EVENT_TRIGGER_FILTER_KEYS.CREATED_AT}
              value={values[EVENT_TRIGGER_FILTER_KEYS.CREATED_AT]}
              onChange={handleDropdownFilterChange}
              placeholder="Select Created On Date"
              components={{
                DropdownIndicator: CustomCalendarIndicator,
                Menu: CustomCalendarMenu,
              }}
              isSearchable={false}
              {...sharedDropdownProps}
              radioLabels={[
                {
                  label: 'Created Date',
                  value: ['createdBefore', 'createdAfter'],
                  default: true,
                },
              ]}
              showDateFilterType={false}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ dueDate: v, createdDate: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.dueDate || undefined,
                isFocused: isCalendarMenuFocused.dueDate || undefined,
              }}
              onBlur={() => setIsCalendarMenuFocused({ dueDate: false, createdDate: false })}
              withTimeRange
            />
          </StyledFlex>
        </StyledFlex>
        <Portal node={customActionsRef?.current}>
          <StyledButton width="125px" onClick={submitForm} variant="contained" primary>
            Confirm
          </StyledButton>
        </Portal>
      </StyledFlex>
    </>
  );
};

export default EventTriggersFilters;
