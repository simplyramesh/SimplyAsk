import { useFormik } from 'formik';
import { useState } from 'react';
import { Portal } from 'react-portal';
import { useRecoilValue } from 'recoil';

import useGetIssues from '../../../../../../hooks/issue/useGetIssues';
import { issuesCategories } from '../../../../../../store';
import { getServiceTicketsTypes } from '../../../../../../store/selectors';
import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteFilter } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledSwitch, StyledText } from '../../../../../shared/styles/styled';
import { ISSUE_CATEGORIES, ISSUE_ENTITY_TYPE, ISSUE_STATUS_MAP } from '../../../../constants/core';
import { PRIORITY_OPTIONS, sharedDropdownProps } from '../../../../constants/options';
import { SERVICE_TICKET_SIDE_FILTER_INITIAL_VALUES } from '../../constants/initialValues';
import ServiceTicketFilterTitleDivider from './ServiceTicketFilterTitleDivider';

const ServiceTicketsFilters = ({ isOpen, onClose, initialValues = {}, onApplyFilters }) => {
  const issuesCategoriesConfig = useRecoilValue(issuesCategories);
  const issuesServiceTicketTypes = useRecoilValue(getServiceTicketsTypes);

  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({ dueDate: false, createdDate: false });

  const { issues: options } = useGetIssues({
    queryKey: ['serviceIssue'],
    filterParams: {
      returnRelatedEntities: true,
      returnAdditionalField: true,
      returnParameters: true,
    },
    issueCategory: ISSUE_CATEGORIES.SERVICE_TICKET,
    options: {
      enabled: isOpen,
      select: (data) => {
        const serviceTicketsCategory = issuesCategoriesConfig.find(
          (category) => category.name === ISSUE_CATEGORIES.SERVICE_TICKET
        );

        const statuses = serviceTicketsCategory?.types?.[0].statuses.map((status) => ({
          status: status.name,
          value: status.id,
          color: ISSUE_STATUS_MAP[status.name.toUpperCase()].color,
        }));

        const mapEntityToOption = (entity) => {
          const relatedEntity = entity?.relatedEntity;
          return { label: relatedEntity?.projectName, value: entity?.id };
        };

        const relatedProcessEntities = data?.content?.flatMap((curr) => {
          if (curr.relatedEntities.length === 0) return [];

          const entityOptions = curr.relatedEntities
            .filter((entity) => entity?.type === ISSUE_ENTITY_TYPE.PROCESS)
            .map(mapEntityToOption);

          return entityOptions;
        });

        return {
          processes: relatedProcessEntities,
          priority: PRIORITY_OPTIONS,
          status: statuses,
          ticketType: issuesServiceTicketTypes,
        };
      },
    },
  });

  const { values, setFieldValue, submitForm, setValues } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(SERVICE_TICKET_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <CustomSidebar open={isOpen} onClose={onClose} headStyleType="filter">
      {({ customActionsRef }) => (
        <>
          {isOpen && (
            <>
              <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
                <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
                  <StyledText size={18} weight={500}>
                    Filter By
                  </StyledText>
                  <StyledButton variant="text" onClick={() => setValues(SERVICE_TICKET_SIDE_FILTER_INITIAL_VALUES)}>
                    Clear All Filters
                  </StyledButton>
                </StyledFlex>
                <StyledFlex>
                  <StyledFlex mb="16px">
                    <CustomSelect
                      name="issueTypeId"
                      options={options?.ticketType}
                      value={values.issueTypeId}
                      onChange={handleDropdownFilterChange}
                      placeholder="Select Ticket Type"
                      components={{
                        DropdownIndicator: CustomIndicatorArrow,
                        Option: CustomCheckboxOption,
                      }}
                      getOptionLabel={(option) => option?.name}
                      getOptionValue={(option) => option?.id}
                      isSearchable={false}
                      isMulti
                      {...sharedDropdownProps}
                      // custom props
                    />
                    <CustomSelect
                      name="status"
                      options={options?.status}
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
                      {...sharedDropdownProps}
                    />
                    <CustomSelect
                      name="priority"
                      options={options?.priority}
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
                    />
                    <StyledFlex direction="column" flex="auto" width="100%">
                      <UserAutocompleteFilter
                        name="assignedTo"
                        placeholder="Search Assignee..."
                        value={values.assignedTo}
                        onChange={handleDropdownFilterChange}
                        isMulti
                        isClearable={false}
                      />
                    </StyledFlex>
                    <CustomSelect
                      name="dueDate"
                      value={values.dueDate}
                      onChange={handleDropdownFilterChange}
                      placeholder="Due Date"
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
                      onMenuInputFocus={(v) => setIsCalendarMenuFocused({ dueDate: v, createdDate: false })}
                      {...{
                        menuIsOpen: isCalendarMenuFocused.dueDate || undefined,
                        isFocused: isCalendarMenuFocused.dueDate || undefined,
                      }}
                      onBlur={() => setIsCalendarMenuFocused({ dueDate: false, createdDate: false })}
                      withTimeRange
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
                          label: 'Created Date',
                          value: ['createdBefore', 'createdAfter'],
                          default: true,
                        },
                      ]}
                      showDateFilterType={false}
                      onMenuInputFocus={(v) => setIsCalendarMenuFocused({ dueDate: false, createdDate: v })}
                      {...{
                        menuIsOpen: isCalendarMenuFocused.createdDate || undefined,
                        isFocused: isCalendarMenuFocused.createdDate || undefined,
                      }}
                      onBlur={() => setIsCalendarMenuFocused({ dueDate: false, createdDate: false })}
                      withTimeRange
                    />
                  </StyledFlex>
                  <StyledFlex>
                    <ServiceTicketFilterTitleDivider title="Source" titleGap="24px 0" gap="0 38px" marginBottom="0px">
                      <ServiceTicketFilterTitleDivider title="Processes" gap="0 30px">
                        <CustomSelect
                          name="relatedEntity"
                          options={options?.processes}
                          value={values.relatedEntity}
                          onChange={handleDropdownFilterChange}
                          placeholder="All Processes"
                          components={{
                            Option: CustomCheckboxOption,
                          }}
                          isSearchable
                          isMulti
                          {...sharedDropdownProps}
                          // custom props
                          withSeparator
                        />
                        <CustomSelect
                          name="projectName"
                          options={options?.projectName}
                          value={values.projectName}
                          onChange={handleDropdownFilterChange}
                          placeholder="Search Processes Tags"
                          components={{
                            Option: CustomCheckboxOption,
                          }}
                          getOptionLabel={(option) => option?.projectName}
                          getOptionValue={(option) => option?.projectName}
                          isSearchable
                          isMulti
                          {...sharedDropdownProps}
                          // custom props
                          withSeparator
                          mb={0}
                          isDisabled
                        />
                      </ServiceTicketFilterTitleDivider>
                      <ServiceTicketFilterTitleDivider title="IVAs" gap="0 30px">
                        <CustomSelect
                          name="projectName"
                          options={options?.projectName}
                          value={values.projectName}
                          onChange={handleDropdownFilterChange}
                          placeholder="All Agents"
                          components={{
                            Option: CustomCheckboxOption,
                          }}
                          getOptionLabel={(option) => option?.projectName}
                          getOptionValue={(option) => option?.projectName}
                          isSearchable
                          isMulti
                          {...sharedDropdownProps}
                          // custom props
                          withSeparator
                          isDisabled
                        />
                        <CustomSelect
                          name="projectName"
                          options={options?.projectName}
                          value={values.projectName}
                          onChange={handleDropdownFilterChange}
                          placeholder="Search Agent Tags"
                          components={{
                            Option: CustomCheckboxOption,
                          }}
                          getOptionLabel={(option) => option?.projectName}
                          getOptionValue={(option) => option?.projectName}
                          isSearchable
                          isMulti
                          {...sharedDropdownProps}
                          // custom props
                          withSeparator
                          isDisabled
                        />
                      </ServiceTicketFilterTitleDivider>
                      <ServiceTicketFilterTitleDivider title="Manual" gap="0 21px" marginBottom="0px">
                        <StyledFlex direction="row" gap="0 20px" alignItems="center">
                          <StyledSwitch
                            name="createdBy"
                            value={values.createdBy}
                            onChange={(e) => {
                              const val = e.target.checked ? ['USER', 'PROCESS', 'AGENT'] : ['PROCESS', 'AGENT'];
                              handleDropdownFilterChange(val, { name: 'createdBy' });
                            }}
                          />
                          <StyledText weight={500}>Show Manually Generated Tickets</StyledText>
                        </StyledFlex>
                      </ServiceTicketFilterTitleDivider>
                    </ServiceTicketFilterTitleDivider>
                  </StyledFlex>
                </StyledFlex>
                <Portal node={customActionsRef?.current}>
                  <StyledButton width="125px" onClick={submitForm} variant="contained" primary>
                    Confirm
                  </StyledButton>
                </Portal>
              </StyledFlex>
            </>
          )}
        </>
      )}
    </CustomSidebar>
  );
};

export default ServiceTicketsFilters;
