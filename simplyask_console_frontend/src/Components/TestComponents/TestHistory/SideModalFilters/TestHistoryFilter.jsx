import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { memo, useState } from 'react';
import { Portal } from 'react-portal';

import { getEnvironments } from '../../../../Services/axios/environment';
import { getTags } from '../../../../Services/axios/test';
import { sharedCalendarDropdownProps } from '../../../Managers/TestManager/SideModals/TestManagerFilters/TestManagerFilters';
import {
  EXECUTION_PROGRESS, EXECUTION_TYPES_OPTIONS, TEST_HISTORY_FILTERS, TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES,
} from '../../../Managers/TestManager/utils/constants';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';

export const fetchOptions = (apiFn, property = '') => debounce((inputVal, setOptions) => {
  apiFn(`searchText=${inputVal}`)
    .then((res) => res?.content.map((item) => ({
      label: item.name,
      value: property === 'tagGenericId' ? item.tagGenericId : item.name,
    })) || [])
    .then((resp) => setOptions(resp));
}, 300);

const TestHistoryFilters = ({
  isOpen, onClose, initialValues = {}, onApplyFilters,
}) => {
  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({
    startTime: false,
    endTime: false,
  });

  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <CustomSidebar
      open={isOpen}
      onClose={onClose}
      headStyleType="filter"
    >
      {({ customActionsRef }) => (
        <StyledFlex flex="1 1 auto" p="24px">
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
            <StyledText size={18} weight={500}>Filter By</StyledText>
            <StyledButton
              variant="text"
              onClick={() => setValues(TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES)}
            >
              Clear All Filters
            </StyledButton>
          </StyledFlex>
          <StyledFlex gap={2}>
            <CustomSelect
              name={TEST_HISTORY_FILTERS.EXECUTION_TYPE}
              options={EXECUTION_TYPES_OPTIONS}
              placeholder="Execution Type"
              value={values[TEST_HISTORY_FILTERS.EXECUTION_TYPE]}
              getOptionValue={({ value }) => value}
              getOptionLabel={({ labelWithIcon }) => labelWithIcon}
              onChange={handleDropdownFilterChange}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
              }}
              minHeight={40}
              menuPadding={0}
              isMulti
              isSearchable={false}
              mb={0}
            />
            <CustomSelect
              name={TEST_HISTORY_FILTERS.STATUS}
              options={EXECUTION_PROGRESS}
              value={values[TEST_HISTORY_FILTERS.STATUS]}
              onChange={handleDropdownFilterChange}
              placeholder="Execution Progress"
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
              }}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              minHeight={40}
              menuPadding={0}
              isMulti
              isSearchable={false}
              mb={0}
            />
            <CustomSelect
              name={TEST_HISTORY_FILTERS.ENVIRONMENT}
              value={values[TEST_HISTORY_FILTERS.ENVIRONMENT]}
              onChange={handleDropdownFilterChange}
              placeholder="Search Environments..."
              isAsync
              loadOptions={fetchOptions(getEnvironments)}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
              }}
              minHeight={40}
              menuPadding={0}
              withSeparator
              isClearable
              isSearchable
              isMulti
              mb={0}
            />
            <CustomSelect
              name={TEST_HISTORY_FILTERS.START_TIME}
              placeholder="Select Start Time"
              onChange={handleDropdownFilterChange}
              value={values[TEST_HISTORY_FILTERS.START_TIME]}
              radioLabels={[
                {
                  label: 'Start Time',
                  value: [TEST_HISTORY_FILTERS.CREATED_BEFORE, TEST_HISTORY_FILTERS.CREATED_AFTER],
                  default: true,
                },
              ]}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ startTime: v, endTime: false })}
              onBlur={() => setIsCalendarMenuFocused({ startTime: false, endTime: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.startTime || undefined,
                isFocused: isCalendarMenuFocused.startTime || undefined,
              }}
              {...sharedCalendarDropdownProps}
            />
            <CustomSelect
              name={TEST_HISTORY_FILTERS.END_TIME}
              placeholder="Select End Time"
              onChange={handleDropdownFilterChange}
              value={values[TEST_HISTORY_FILTERS.END_TIME]}
              radioLabels={[
                {
                  label: 'End Time',
                  value: [TEST_HISTORY_FILTERS.EXECUTED_BEFORE, TEST_HISTORY_FILTERS.EXECUTED_AFTER],
                  default: true,
                },
              ]}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ startTime: false, endTime: v })}
              onBlur={() => setIsCalendarMenuFocused({ startTime: false, endTime: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.endTime || undefined,
                isFocused: isCalendarMenuFocused.endTime || undefined,
              }}
              {...sharedCalendarDropdownProps}
            />
            <CustomSelect
              name={TEST_HISTORY_FILTERS.TAGS}
              value={values[TEST_HISTORY_FILTERS.TAGS]}
              isAsync
              loadOptions={fetchOptions(getTags, 'tagGenericId')}
              onChange={handleDropdownFilterChange}
              placeholder="Search Tags"
              closeMenuOnSelect
              closeMenuOnScroll
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
              }}
              minHeight={40}
              menuPadding={0}
              withSeparator
              isClearable
              isSearchable
              isMulti
              mb={0}
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
      )}
    </CustomSidebar>
  );
};

export default memo(TestHistoryFilters);
