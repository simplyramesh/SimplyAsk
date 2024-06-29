import { useFormik } from 'formik';
import { Portal } from 'react-portal';

import ServiceTicketFilterTitleDivider from '../../../../Issues/components/ServiceTickets/components/ServiceTicketsFilters/ServiceTicketFilterTitleDivider';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteFilter } from '../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText, StyledSwitch } from '../../../../shared/styles/styled';
import { CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS } from '../../../utils/constants';
import { getDefaultServiceTicketSideFilterSwitchesVal } from '../../../utils/initialValuesHelpers';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: true,
  openMenuOnClick: true,
};

const ChartFiltersSideServiceTickets = ({
  customActionsRef,
  initialValues = {},
  onApplyFilters,
  isLoading,
  showFiltersType,
  allProcessesOptions = [],
  allAgentsOptions = [],
}) => {
  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters?.(val);
      meta.resetForm(initialValues);
    },
  });

  const processesTagsOptions = allProcessesOptions?.map((process) => process.tags)?.flat() || [];
  const allAgentTagsOptions = allAgentsOptions?.map((agent) => agent.tags)?.flat() || [];

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  if (isLoading) return <Spinner fadeBgParent medium />;

  return (
    <StyledFlex flex="1 1 auto" p="0 24px 44px 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => setValues(getDefaultServiceTicketSideFilterSwitchesVal?.(showFiltersType))}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>

        {showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]
        && (
          <StyledFlex direction="column" flex="auto" width="100%" marginBottom="20px">
            <UserAutocompleteFilter
              name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS}
              placeholder="Search Assigned Agents..."
              value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]}
              onChange={handleDropdownFilterChange}
              isMulti
              showCheckBoxOptions
              {...sharedDropdownProps}
            />
          </StyledFlex>
        )}

        <StyledFlex>

          <ServiceTicketFilterTitleDivider
            title="Source"
            titleGap="24px 0"
            gap="0 38px"
            marginBottom="0px"
          >
            <ServiceTicketFilterTitleDivider
              title="Processes"
              gap="0 30px"
            >
              <StyledFlex maxWidth="486px">
                <CustomSelect
                  name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES}
                  options={allProcessesOptions}
                  value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES] || []}
                  onChange={handleDropdownFilterChange}
                  placeholder="All Processes"
                  components={{
                    Option: CustomCheckboxOption,
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  isMulti
                  {...sharedDropdownProps}
                  withSeparator
                />
                <CustomSelect
                  name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS}
                  options={processesTagsOptions}
                  value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS] || []}
                  onChange={handleDropdownFilterChange}
                  placeholder="Search Processes Tags"
                  components={{
                    Option: CustomCheckboxOption,
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  isMulti
                  {...sharedDropdownProps}
                  withSeparator
                  mb={0}
                />
              </StyledFlex>
            </ServiceTicketFilterTitleDivider>
            <ServiceTicketFilterTitleDivider
              title="IVAs"
              gap="0 30px"
            >
              <StyledFlex maxWidth="486px">
                <CustomSelect
                  name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS}
                  options={allAgentsOptions}
                  value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS] || []}
                  onChange={handleDropdownFilterChange}
                  placeholder="All Agents"
                  components={{
                    Option: CustomCheckboxOption,
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  isMulti
                  {...sharedDropdownProps}
                  withSeparator
                />
                <CustomSelect
                  name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS}
                  options={allAgentTagsOptions}
                  value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS] || []}
                  onChange={handleDropdownFilterChange}
                  placeholder="Search Agent Tags"
                  components={{
                    Option: CustomCheckboxOption,
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  isMulti
                  {...sharedDropdownProps}
                  withSeparator
                />
              </StyledFlex>
            </ServiceTicketFilterTitleDivider>
            <ServiceTicketFilterTitleDivider
              title="Manual"
              gap="0 21px"
              marginBottom="0px"
            >
              <StyledFlex direction="row" gap="0 20px" alignItems="center">
                <StyledSwitch
                  name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS}
                  checked={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS]}
                  onChange={(e) => handleDropdownFilterChange(
                    e.target.checked,
                    { name: CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS },
                  )}
                />
                <StyledText weight={500}>Show Manually Generated Tickets</StyledText>
              </StyledFlex>
            </ServiceTicketFilterTitleDivider>
          </ServiceTicketFilterTitleDivider>
        </StyledFlex>

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

export default ChartFiltersSideServiceTickets;
