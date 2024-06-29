import { useFormik } from 'formik';
import { Portal } from 'react-portal';

import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomCalendarMenu from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import CustomCalendarIndicator from '../../../../../AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 450,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
};

const ServiceTicketTypeFilters = ({
  customActionsRef,
  initialValues = {},
  onApplyFilters = () => { },
}) => {
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
    <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
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
          placeholder="Last Updated"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          // custom props
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
          placeholder="Created On"
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

export default ServiceTicketTypeFilters;
