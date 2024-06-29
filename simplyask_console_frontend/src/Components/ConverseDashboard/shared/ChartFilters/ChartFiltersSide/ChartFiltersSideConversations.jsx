import { useFormik } from 'formik';
import { Portal } from 'react-portal';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS } from '../../../utils/constants';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: true,
  openMenuOnClick: true,
};

const ChartFiltersSideConversations = ({
  customActionsRef,
  initialValues = {},
  onApplyFilters,
  isLoading,
  allAgentsOptions = [],
  showFiltersType,
}) => {
  const allAgentTagsOptions = allAgentsOptions?.map((agent) => agent.tags)?.flat() || [];

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

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  if (isLoading) return <Spinner fadeBgParent medium />;

  return (
    <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => setValues({})}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        {showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]
        && (
          <CustomSelect
            name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS}
            options={allAgentsOptions}
            value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]}
            onChange={handleDropdownFilterChange}
            placeholder="Search Agents..."
            components={{
              Option: CustomCheckboxOption,
              DropdownIndicator: CustomIndicatorArrow,
            }}
            {...sharedDropdownProps}
            isSearchable
            withSeparator
            isMulti
          />
        )}

        {showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]
        && (
          <CustomSelect
            name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS}
            options={allAgentTagsOptions}
            value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]}
            onChange={handleDropdownFilterChange}
            placeholder="Search Agent Tags..."
            components={{
              Option: CustomCheckboxOption,
              DropdownIndicator: CustomIndicatorArrow,
            }}
            {...sharedDropdownProps}
            isSearchable
            withSeparator
            isMulti
          />
        )}
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

export default ChartFiltersSideConversations;
