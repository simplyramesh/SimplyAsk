import { useFormik } from 'formik';
import { memo, useState } from 'react';
import { Portal } from 'react-portal';

import { getTags } from '../../../../../Services/axios/test';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { fetchOptions } from '../../../../TestComponents/TestHistory/SideModalFilters/TestHistoryFilter';
import { TEST_MANAGER_FILTER_INITIAL_VALUES } from '../../constants/formatters';

export const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 700,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  isSearchable: false,
  openMenuOnClick: true,
  mb: 0,
};

export const sharedCalendarDropdownProps = {
  ...sharedDropdownProps,
  showDateFilterType: false,
  withTimeRange: true,
  components: {
    DropdownIndicator: CustomCalendarIndicator,
    Menu: CustomCalendarMenu,
  },
};

const TestManagerFilters = ({
  isOpen,
  onClose,
  initialValues = {},
  onApplyFilters,
}) => {
  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({
    updatedDate: false,
    createdDate: false,
    executedDate: false,
  });

  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(TEST_MANAGER_FILTER_INITIAL_VALUES.sideFilter);
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
        <>
          {isOpen && (
            <StyledFlex flex="1 1 auto" p="24px">
              <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
                <StyledText size={18} weight={500}>Filter By</StyledText>
                <StyledButton
                  variant="text"
                  onClick={() => {
                    setValues(TEST_MANAGER_FILTER_INITIAL_VALUES.sideFilter);
                  }}
                >
                  Clear All Filters
                </StyledButton>
              </StyledFlex>

              <StyledFlex gap={2}>
                <CustomSelect
                  name="createdDate"
                  value={values.createdDate}
                  onChange={handleDropdownFilterChange}
                  placeholder="Select Created On Date"
                  radioLabels={[
                    {
                      label: 'Created Date',
                      value: ['createdBefore', 'createdAfter'],
                      default: true,
                    },
                  ]}
                  onMenuInputFocus={(v) => setIsCalendarMenuFocused({ executedDate: false, updatedDate: false, createdDate: v })}
                  onBlur={() => setIsCalendarMenuFocused({ executedDate: false, updatedDate: false, createdDate: false })}
                  {...{
                    menuIsOpen: isCalendarMenuFocused.createdDate || undefined,
                    isFocused: isCalendarMenuFocused.createdDate || undefined,
                  }}
                  {...sharedCalendarDropdownProps}
                />

                <CustomSelect
                  name="editedDate"
                  value={values.editedDate}
                  onChange={handleDropdownFilterChange}
                  placeholder="Select Last Edited Date"
                  radioLabels={[
                    {
                      label: 'Edited Date',
                      value: ['editedBefore', 'editedAfter'],
                      default: true,
                    },
                  ]}
                  onMenuInputFocus={(v) => setIsCalendarMenuFocused({ executedDate: false, editedDate: v, createdDate: false })}
                  onBlur={() => setIsCalendarMenuFocused({ executedDate: false, editedDate: false, createdDate: false })}
                  {...{
                    menuIsOpen: isCalendarMenuFocused.editedDate || undefined,
                    isFocused: isCalendarMenuFocused.editedDate || undefined,
                  }}
                  {...sharedCalendarDropdownProps}
                />

                <CustomSelect
                  name="executedDate"
                  value={values.executedDate}
                  onChange={handleDropdownFilterChange}
                  placeholder="Select Last Executed Date"
                  radioLabels={[
                    {
                      label: 'Executed Date',
                      value: ['executedBefore', 'executedAfter'],
                      default: true,
                    },
                  ]}
                  onMenuInputFocus={(v) => setIsCalendarMenuFocused({ executedDate: v, updatedDate: false, createdDate: false })}
                  onBlur={() => setIsCalendarMenuFocused({ executedDate: false, updatedDate: false, createdDate: false })}
                  {...{
                    menuIsOpen: isCalendarMenuFocused.executedDate || undefined,
                    isFocused: isCalendarMenuFocused.executedDate || undefined,
                  }}
                  {...sharedCalendarDropdownProps}
                />
                <CustomSelect
                  name="tags"
                  value={values.tags}
                  isAsync
                  loadOptions={fetchOptions(getTags, 'tagGenericId')}
                  onChange={handleDropdownFilterChange}
                  placeholder="Select Tags"
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
        </>
      )}
    </CustomSidebar>
  );
};

export default memo(TestManagerFilters);
