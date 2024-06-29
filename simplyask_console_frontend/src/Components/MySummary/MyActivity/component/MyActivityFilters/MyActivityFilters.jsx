import PropTypes from 'prop-types';
import React from 'react';

import CustomCalendarIndicator
  from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import {
  StyledUserGroupsFiltersContainer,
  StyledUserGroupsFiltersContent,
  StyledUserGroupsFiltersHeader,
} from '../../../../Settings/AccessManagement/components/filters/PermissionGroupsFilters/StyledPermissionGroupsFilters';
import AdditionalActionButton from '../../../../shared/REDISIGNED/table/components/AdditionalActionButton/AdditionalActionButton';
import { StyledText } from '../../../../shared/styles/styled';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';

const MyActivityFilters = ({
  myActivityFilters, onFilterChange, onClearFilters,
}) => {
  return (
    <StyledUserGroupsFiltersContainer>
      <StyledUserGroupsFiltersHeader>
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <AdditionalActionButton onClick={onClearFilters} text="Clear All Filters" />
      </StyledUserGroupsFiltersHeader>
      <StyledUserGroupsFiltersContent>
        <CustomSelect
          name="date"
          placeholder="Select Date and Time"
          onChange={onFilterChange}
          value={myActivityFilters?.createdDate}
          closeMenuOnSelect={false}
          openMenuOnClick
          isClearable={false}
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
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
          showDataFilterType={false}
        />
      </StyledUserGroupsFiltersContent>
    </StyledUserGroupsFiltersContainer>
  );
};

export default MyActivityFilters;

MyActivityFilters.propTypes = {
  myActivityFilters: PropTypes.object,
  onClearFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
};
