import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Portal } from 'react-portal';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import {
  StyledFlex, StyledText,
} from '../../../../shared/styles/styled';

const MyIssuesFilter = ({ sidebarActionsRef, initialValues, onApplyFilters, onResetFilters, issueCategories }) => {
  const theme = useTheme();
  const [issueCategoriesOptions, setIssueCategoriesOptions] = useState([]);

  const sharedDropdownProps = {
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    isClearable: false,
    openMenuOnClick: true,
    customTheme: theme,
  };

  const {
    values, setFieldValue, submitForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: onApplyFilters,
  });

  useEffect(() => {
    if (issueCategories?.length) {
      setIssueCategoriesOptions(issueCategories.map((category) => ({
        label: category.name,
        value: category.id,
      })));
    }
  }, [issueCategories]);

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
    >
      <StyledFlex flex="1 1 auto" p="0 24px">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
          <StyledText size={18} weight={500}>Filter By</StyledText>
          <StyledButton
            variant="text"
            onClick={() => onResetFilters()}
          >
            Clear All Filters
          </StyledButton>
        </StyledFlex>
        <CustomSelect
          value={values.createdDate}
          onChange={(val) => setFieldValue('createdDate', val)}
          placeholder="Select Date Created"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          {...sharedDropdownProps}
          radioLabels={[
            {
              label: 'Started Date',
              value: ['createdBefore', 'createdAfter'],
              default: true,
            },
            {
              label: 'Ended Date',
              value: ['createdBefore', 'createdAfter'],
              default: false,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          value={values.dueDate}
          onChange={(val) => setFieldValue('dueDate', val)}
          placeholder="Select Due Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          {...sharedDropdownProps}
          radioLabels={[
            {
              label: 'Started Date',
              value: ['dueBefore', 'dueAfter'],
              default: true,
            },
            {
              label: 'Ended Date',
              value: ['dueBefore', 'dueAfter'],
              default: false,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name="issueTypes"
          value={values.issueCategoryId}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          isSearchable={false}
          isMulti
          hideMultiValueRemove
          options={issueCategoriesOptions}
          onChange={(e) => {setFieldValue('issueCategoryId', e)}}
          placeholder="Select Issue Type"
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          onMenuClose={() => {}}
        />
        <Portal node={sidebarActionsRef?.current}>
          <StyledButton
            primary
            variant="contained"
            onClick={submitForm}
          >
            Apply
          </StyledButton>
        </Portal>
      </StyledFlex>
    </Scrollbars>
  );
};

export default MyIssuesFilter;
