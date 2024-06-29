import PropTypes from 'prop-types';

import AdditionalActionButton from '../../../../../shared/REDISIGNED/table/components/AdditionalActionButton/AdditionalActionButton';
import { StyledText } from '../../../../../shared/styles/styled';
import CustomCalendarIndicator from '../../dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../dropdowns/customComponents/calendarMenu/CustomCalendarMenu';
import CustomCheckboxOptions from '../../dropdowns/customComponents/checkboxOptions/CustomCheckboxOptions';
import CustomDropdownIndicator from '../../dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import FilterDropdown from '../../dropdowns/FilterDropdown/FilterDropdown';
import {
  StyledUserGroupsFiltersContainer,
  StyledUserGroupsFiltersContent,
  StyledUserGroupsFiltersHeader,
} from './StyledUserGroupsFilters';

const UserGroupsFilters = ({ userGroupsFilters, onFilterChange, onClearFilters, roles }) => {
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
        <FilterDropdown
          name="roles"
          placeholder="Select Special Role"
          components={{ DropdownIndicator: CustomDropdownIndicator, Option: CustomCheckboxOptions }}
          options={roles}
          getOptionLabel={(option) => `${option.role.split('_').join(' ')}`}
          getOptionValue={(option) => option.id}
          value={userGroupsFilters.roles}
          onChange={onFilterChange}
          extraPaddingY
          openMenuOnClick
          isSearchable={false}
          closeMenuOnSelect={false}
          isClearable={false}
          hideSelectedOptions={false}
          isMulti
          labelKey="role"
          valueKey="id"
        />
      </StyledUserGroupsFiltersContent>
    </StyledUserGroupsFiltersContainer>
  );
};

export default UserGroupsFilters;

UserGroupsFilters.propTypes = {
  onClearFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
  userGroupsFilters: PropTypes.object,
  roles: PropTypes.arrayOf(PropTypes.object),
};
