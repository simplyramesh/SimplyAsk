import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { Portal } from 'react-portal';
import { useRecoilValue } from 'recoil';
import useGetIssues from '../../../../../../hooks/issue/useGetIssues';
import { getServiceTicketTasksCategory } from '../../../../../../store/selectors';
import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteFilter } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { ISSUES_QUERY_KEYS, ISSUE_CATEGORIES, ISSUE_STATUS_MAP } from '../../../../constants/core';
import { SERVICE_TICKET_TASKS_SIDE_FILTER_INITIAL_VALUES } from '../../../ServiceTickets/constants/initialValues';
import { RESOLVED_BY_OPTIONS } from '../../utills/helpers';

const TicketTasksFilter = ({ sidebarActionsRef, initialValues, onApplyFilters, parentId }) => {
  const theme = useTheme();

  const serviceTicketsCategory = useRecoilValue(getServiceTicketTasksCategory);

  const statuses = serviceTicketsCategory?.types?.flatMap((type) =>
    type?.statuses?.map((status) => ({
      status: ISSUE_STATUS_MAP[status.name]?.label,
      value: status.id,
      color: ISSUE_STATUS_MAP[status.name]?.color,
    }))
  );

  const sharedDropdownProps = {
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    isClearable: false,
    openMenuOnClick: true,
    customTheme: theme,
  };

  const { values, setFieldValue, submitForm, setValues } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(SERVICE_TICKET_TASKS_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const { issues: issuesServiceTickets } = useGetIssues({
    queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS,
    filterParams: {
      issueId: parentId?.join(', '),
      returnParameters: true,
      returnRelatedEntities: true,
    },
    issueCategory: ISSUE_CATEGORIES.SERVICE_TICKET,
    options: {
      enabled: !!parentId,
      select: (data) => data?.content?.map((item) => ({ label: item.displayName, value: item.id })) ?? [],
      placeholderData: [],
    },
  });

  const renderAssociatedServiceTickets = () =>
    parentId ? (
      <CustomSelect
        placeholder="Search Service Ticket Names or IDs..."
        options={issuesServiceTickets}
        value={values.parentId}
        onChange={(option) => setFieldValue('parentIssueId', option)}
        isSearchable
        isMulti
        {...sharedDropdownProps}
        isLoading={!issuesServiceTickets}
        isDisabled={!issuesServiceTickets}
      />
    ) : null;

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <StyledButton variant="text" onClick={() => setValues(SERVICE_TICKET_TASKS_SIDE_FILTER_INITIAL_VALUES)}>
          Reset All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        <CustomSelect
          name="status"
          options={statuses}
          value={values.status}
          onChange={handleDropdownFilterChange}
          placeholder="Select Status"
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          getOptionLabel={(option) => option?.status}
          getOptionValue={(option) => option?.value}
          isSearchable={false}
          isMulti
          withSeparator
          {...sharedDropdownProps}
          menuPortalTarget={document.body}
        />
        {renderAssociatedServiceTickets()}
        <UserAutocompleteFilter
          name="assignedTo"
          placeholder="Search Assignee..."
          value={values.assignedTo}
          onChange={handleDropdownFilterChange}
          isMulti
          closeMenuOnSelect={false}
          isClearable={false}
          menuPortalTarget={document.body}
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
          minMenuHeight={500}
          maxMenuHeight={540}
          isSearchable={false}
          {...sharedDropdownProps}
          // custom props
          radioLabels={[
            {
              label: 'Created Date',
              value: ['createdBefore', 'createdAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name="resolvedDate"
          value={values.resolvedDate}
          onChange={handleDropdownFilterChange}
          placeholder="Select Resolved On"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          minMenuHeight={500}
          maxMenuHeight={540}
          {...sharedDropdownProps}
          // custom props
          radioLabels={[
            {
              label: 'Resolved Date',
              value: ['resolvedBefore', 'resolvedAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name="resolvedBy"
          options={RESOLVED_BY_OPTIONS}
          value={values.resolvedBy}
          onChange={handleDropdownFilterChange}
          placeholder="Search Resolved By..."
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          isSearchable={false}
          isMulti
          {...sharedDropdownProps}
          menuPortalTarget={document.body}
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

export default TicketTasksFilter;
