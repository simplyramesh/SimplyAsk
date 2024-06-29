import { useFormik } from 'formik';
import { Portal } from 'react-portal';
import { useRecoilValue } from 'recoil';
import { getFalloutTicketsStatuses } from '../../../../../../store/selectors';
import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteFilter } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { PRIORITY_OPTIONS } from '../../../../constants/options';
import { FALLOUT_TICKET_FILTER_KEYS, FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES } from '../../constants/constants';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
};

const FalloutTicketsFilters = ({ sidebarActionsRef, initialValues = {}, onApplyFilters, isOpen }) => {
  const falloutTicketStatuses = useRecoilValue(getFalloutTicketsStatuses);

  const statuses = falloutTicketStatuses.map((status) => ({
    label: status.name,
    status: status.name,
    value: status.id,
    color: status.colour,
  }));

  const { values, setFieldValue, submitForm, setValues } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <>
      <StyledFlex flex="1 1 auto" p="24px">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
          <StyledText size={18} weight={500}>
            Filter By
          </StyledText>
          <StyledButton variant="text" onClick={() => setValues(FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES)}>
            Clear All Filters
          </StyledButton>
        </StyledFlex>
        <StyledFlex>
          <CustomSelect
            name={FALLOUT_TICKET_FILTER_KEYS.PRIORITY}
            options={PRIORITY_OPTIONS}
            placeholder="Select Priority"
            value={values.priority}
            getOptionValue={({ value }) => value}
            isClearable={false}
            isSearchable={false}
            onChange={handleDropdownFilterChange}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option: CustomCheckboxOption,
            }}
            getOptionLabel={({ labelWithIcon }) => labelWithIcon}
            menuPadding={0}
            menuPortalTarget={document.body}
            isMulti
            {...sharedDropdownProps}
          />

          <CustomSelect
            name={FALLOUT_TICKET_FILTER_KEYS.STATUS}
            options={statuses}
            value={values[FALLOUT_TICKET_FILTER_KEYS.STATUS]}
            onChange={handleDropdownFilterChange}
            placeholder="Select Status"
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option: CustomCheckboxOption,
            }}
            isSearchable={false}
            isMulti
            {...sharedDropdownProps}
          />

          <CustomSelect
            name={FALLOUT_TICKET_FILTER_KEYS.CREATED_DATE}
            value={values[FALLOUT_TICKET_FILTER_KEYS.CREATED_DATE]}
            onChange={handleDropdownFilterChange}
            placeholder="Select Incident Time"
            components={{
              DropdownIndicator: CustomCalendarIndicator,
              Menu: CustomCalendarMenu,
            }}
            isSearchable={false}
            {...sharedDropdownProps}
            // custom props
            radioLabels={[
              {
                label: 'Incident Time',
                value: ['createdBefore', 'createdAfter'],
                default: true,
              },
            ]}
            showDateFilterType={false}
          />

          <StyledFlex direction="column" flex="auto" width="100%">
            <UserAutocompleteFilter
              name={FALLOUT_TICKET_FILTER_KEYS.ASSIGNED_TO}
              placeholder="Search Assignee..."
              value={values[FALLOUT_TICKET_FILTER_KEYS.ASSIGNED_TO]}
              onChange={handleDropdownFilterChange}
              isMulti
              {...sharedDropdownProps}
            />
          </StyledFlex>

          <CustomSelect
            name={FALLOUT_TICKET_FILTER_KEYS.DUE_DATE}
            value={values[FALLOUT_TICKET_FILTER_KEYS.DUE_DATE]}
            onChange={handleDropdownFilterChange}
            placeholder="Select Due Date"
            components={{
              DropdownIndicator: CustomCalendarIndicator,
              Menu: CustomCalendarMenu,
            }}
            isSearchable={false}
            {...sharedDropdownProps}
            // custom props
            radioLabels={[
              {
                label: 'Due Date',
                value: ['dueBefore', 'dueAfter'],
                default: true,
              },
            ]}
            showDateFilterType={false}
          />
        </StyledFlex>
        <Portal node={sidebarActionsRef?.current}>
          <StyledButton primary variant="contained" onClick={submitForm}>
            Confirm
          </StyledButton>
        </Portal>
      </StyledFlex>
    </>
  );
};

export default FalloutTicketsFilters;
