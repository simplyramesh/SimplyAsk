import React from 'react'
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled'
import { Portal } from 'react-portal'
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton'
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect'
import CustomCalendarIndicator from '../../../../../AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator'
import CustomCalendarMenu from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu'
import { useFormik } from 'formik'

const KnowledgeBasesFilters = ({
  customActionsRef,
  initialValues = {},
  onApplyFilters = () => { },
}) => {
  const sharedDropdownProps = {
    minMenuHeight: 150,
    maxMenuHeight: 550,
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    isClearable: false,
    openMenuOnClick: true,
  };

  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(initialValues);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <StyledFlex p="0 24px 24px 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => setValues({ createdDate: '', updatedDate: '' })}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        <CustomSelect
          name="updatedDate"
          value={values.updatedDate}
          onChange={handleDropdownFilterChange}
          placeholder="Select Last Updated"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          radioLabels={[
            {
              label: 'Last Updated',
              value: ['updatedBefore', 'updatedAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name="createdDate"
          value={values.createdDate}
          onChange={handleDropdownFilterChange}
          placeholder="Select Created On"
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
  )
}

export default KnowledgeBasesFilters