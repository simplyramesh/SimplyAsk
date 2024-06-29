import styled from '@emotion/styled';
import { useFormik } from 'formik';
import { useEffect } from 'react';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledFlex } from '../../../../shared/styles/styled';
import useAgents from '../../hooks/useAgents';

const StyledFlexResponsiveWrapper = styled(StyledFlex)`
  @media only screen and (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;

    & > div:nth-of-type(2) {
      grid-row: 2/2;
      grid-column: 1/2;
    }

    & > div:nth-of-type(4) {
      grid-column: 2/2;
      grid-row: 1/2;
    }
  }
`;

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  minMenuWidth: 340,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
  height: 34,
  minHeight: 34,
  maxHeight: 34,
  mb: 0,
  menuPortalTarget: document.body,
  placeholderFontSize: 15,
  singleValueFontSize: 15,
};

const AgentManagerModalWidgetFilters = ({ initialValues = {}, onApplyFilters = () => {}, onSearch, searchText }) => {
  const { values, setFieldValue, submitForm, dirty } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(initialValues);
    },
  });

  useEffect(() => {
    if (dirty) {
      submitForm();
    }
  }, [values, dirty]);

  const { agents: getAllAgentsOption } = useAgents(
    { pageSize: 999 },
    {
      select: (res) => {
        const content = res?.content || [];
        const format = content.map((item) => ({
          label: item.name,
          value: item.agentId,
        }));

        return format;
      },
    }
  );

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  return (
    <StyledFlexResponsiveWrapper gap="15px" alignItems="center" display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr">
      <SearchBar
        placeholder="Search Chat Widgets..."
        onChange={onSearch}
        width="100%"
        fontSize={15}
        value={searchText}
      />

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
        menuWidth="555px"
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
        menuWidth="555px"
        menuRightPosition={1}
      />

      <CustomSelect
        name="agents"
        options={getAllAgentsOption ?? []}
        value={values.agents}
        onChange={handleDropdownFilterChange}
        placeholder="Select Assigned Agents"
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          Option: CustomCheckboxOption,
        }}
        isSearchable
        isMulti
        {...sharedDropdownProps}
        maxMenuHeight={400}
      />
    </StyledFlexResponsiveWrapper>
  );
};

export default AgentManagerModalWidgetFilters;
