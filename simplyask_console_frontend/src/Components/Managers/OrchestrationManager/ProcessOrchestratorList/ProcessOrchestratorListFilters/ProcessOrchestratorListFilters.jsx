import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Portal } from 'react-portal';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomDropdownIndicator from '../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES } from '../constants/initialValues';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 650,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
};

const ProcessOrchestratorListFilters = ({
  isOpen, onClose, initialValues, onApplyFilters, tagOptions,
}) => {
  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({ updatedDate: false, createdDate: false, executedDate: false });

  const {
    values, setFieldValue, setValues, submitForm,
  } = useFormik({
    initialValues: {
      ...ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES,
      ...initialValues,
    },
    onSubmit: (submitValues, meta) => {
      onApplyFilters(submitValues);
      meta.resetForm(ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (value, { name }) => {
    setFieldValue(name, value);
  };

  return (
    <CustomSidebar
      open={isOpen}
      onClose={onClose}
      headStyleType="filter"
    >
      {({ customActionsRef }) => isOpen && (
        <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
            <StyledText size={18} weight={500}>Filter By</StyledText>
            <StyledButton
              variant="text"
              onClick={() => setValues(ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES)}
              disableRipple
            >
              Clear All Filters
            </StyledButton>
          </StyledFlex>
          <StyledFlex>
            <CustomSelect
              name="executedDate"
              value={values.executedDate}
              onChange={handleDropdownFilterChange}
              placeholder="Select Last Executed Date and Time"
              components={{
                DropdownIndicator: CustomCalendarIndicator,
                Menu: CustomCalendarMenu,
              }}
              isSearchable={false}
              {...sharedDropdownProps}
              // custom props
              radioLabels={[
                {
                  label: 'Last Executed',
                  value: ['executedBefore', 'executedAfter'],
                  default: true,
                },
              ]}
              showDateFilterType={false}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ executedDate: v, createdDate: false, updatedDate: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.executedDate || undefined,
                isFocused: isCalendarMenuFocused.executedDate || undefined,
              }}
              onBlur={() => setIsCalendarMenuFocused({ executedDate: false, createdDate: false, updatedDate: false })}
              withTimeRange
            />
            <CustomSelect
              name="updatedDate"
              value={values.updatedDate}
              onChange={handleDropdownFilterChange}
              placeholder="Select Last Edited Date and Time"
              components={{
                DropdownIndicator: CustomCalendarIndicator,
                Menu: CustomCalendarMenu,
              }}
              isSearchable={false}
              {...sharedDropdownProps}
              // custom props
              radioLabels={[
                {
                  label: 'Last Executed',
                  value: ['updatedBefore', 'updatedAfter'],
                  default: true,
                },
              ]}
              showDateFilterType={false}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ executedDate: false, createdDate: false, updatedDate: v })}
              {...{
                menuIsOpen: isCalendarMenuFocused.updatedDate || undefined,
                isFocused: isCalendarMenuFocused.updatedDate || undefined,
              }}
              onBlur={() => setIsCalendarMenuFocused({ executedDate: false, createdDate: false, updatedDate: false })}
              withTimeRange
            />
            <CustomSelect
              name="createdDate"
              value={values.createdDate}
              onChange={handleDropdownFilterChange}
              placeholder="Select Created On Edited Date and Time"
              components={{
                DropdownIndicator: CustomCalendarIndicator,
                Menu: CustomCalendarMenu,
              }}
              isSearchable={false}
              {...sharedDropdownProps}
              // custom props
              radioLabels={[
                {
                  label: 'Created On',
                  value: ['createdBefore', 'createdAfter'],
                  default: true,
                },
              ]}
              showDateFilterType={false}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ executedDate: false, createdDate: v, updatedDate: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.createdDate || undefined,
                isFocused: isCalendarMenuFocused.createdDate || undefined,
              }}
              onBlur={() => setIsCalendarMenuFocused({ executedDate: false, createdDate: false, updatedDate: false })}
              withTimeRange
            />
            <CustomSelect
              options={tagOptions}
              name="tags"
              value={values.tags}
              onChange={handleDropdownFilterChange}
              placeholder="Select Tags"
              components={{
                DropdownIndicator: CustomDropdownIndicator,
              }}
              getOptionLabel={(option) => option}
              getOptionValue={(option) => option}
              {...sharedDropdownProps}
              isMulti
              withSeparator
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

export default ProcessOrchestratorListFilters;
