import PropTypes from 'prop-types';

import AdditionalActionButton from '../../../../../shared/REDISIGNED/table/components/AdditionalActionButton/AdditionalActionButton';
import { StyledText } from '../../../../../shared/styles/styled';
import CustomCalendarIndicator from '../../dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../dropdowns/customComponents/calendarMenu/CustomCalendarMenu';
import FilterDropdown from '../../dropdowns/FilterDropdown/FilterDropdown';
import {
  StyledUserGroupsFiltersContainer,
  StyledUserGroupsFiltersContent,
  StyledUserGroupsFiltersHeader,
} from './StyledPermissionGroupsFilters';

const PermissionGroupsFilters = ({ userGroupsFilters, onFilterChange, onClearFilters }) => {
  return (
    <StyledUserGroupsFiltersContainer>
      <StyledUserGroupsFiltersHeader>
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <AdditionalActionButton onClick={onClearFilters} text="Clear All Filters" />
      </StyledUserGroupsFiltersHeader>
      <StyledUserGroupsFiltersContent>
        <FilterDropdown
          name="created"
          placeholder="Created Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          onFilterSelect={onFilterChange}
          filterValue={userGroupsFilters.createdDate}
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          isDateModified={false}
        />
        <FilterDropdown
          name="edited"
          placeholder="Modified Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          onFilterSelect={onFilterChange}
          filterValue={userGroupsFilters.editedDate}
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          isDateModified={false}
        />
      </StyledUserGroupsFiltersContent>
    </StyledUserGroupsFiltersContainer>
  );
};

export default PermissionGroupsFilters;

PermissionGroupsFilters.propTypes = {
  onClearFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
  userGroupsFilters: PropTypes.object,
};
