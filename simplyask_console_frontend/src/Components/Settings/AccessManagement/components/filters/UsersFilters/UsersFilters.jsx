import PropTypes from 'prop-types';

import AdditionalActionButton from '../../../../../shared/REDISIGNED/table/components/AdditionalActionButton/AdditionalActionButton';
import { StyledText } from '../../../../../shared/styles/styled';
import CustomCalendarIndicator from '../../dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../dropdowns/customComponents/calendarMenu/CustomCalendarMenu';
import CustomCheckboxOptions from '../../dropdowns/customComponents/checkboxOptions/CustomCheckboxOptions';
import CustomDropdownIndicator from '../../dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import FilterDropdown from '../../dropdowns/FilterDropdown/FilterDropdown';
import StatusBadge from '../../StatusBadge/StatusBadge';
import { StyledUsersFiltersContainer, StyledUsersFiltersContent, StyledUsersFiltersHeader } from './StyledUsersFilters';

const STATUS_FILTER_OPTIONS = [
  {
    value: true,
    label: <StatusBadge icon="DEACTIVATED" />,
    columnId: 'isLocked',
    type: 'statusBadge',
  },
  {
    value: false,
    label: <StatusBadge icon="ACTIVATED" />,
    columnId: 'isLocked',
    type: 'statusBadge',
  },
];

const UsersFilters = ({
  usersFilters,
  onFilterChange,
  onClearFilters,
  roles,
  dropdownRefs,
}) => {
  const { roleRef, statusRef } = dropdownRefs;

  return (
    <StyledUsersFiltersContainer>
      <StyledUsersFiltersHeader>
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <AdditionalActionButton onClick={onClearFilters} text="Clear All Filters" />
      </StyledUsersFiltersHeader>
      <StyledUsersFiltersContent>
        <FilterDropdown
          name="created"
          placeholder="Created Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          onFilterSelect={onFilterChange}
          filterValue={usersFilters.createdDate}
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
          filterValue={usersFilters.editedDate}
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          isDateModified={false}
        />
        <FilterDropdown
          name="isLocked" // IMPORTANT: name must be the same as the API key for filter change
          placeholder="Select Status"
          components={{ DropdownIndicator: CustomDropdownIndicator, Option: CustomCheckboxOptions }}
          options={STATUS_FILTER_OPTIONS}
          onChange={onFilterChange}
          isSearchable={false}
          closeMenuOnSelect={false}
          isClearable={false}
          hideSelectedOptions={false}
          value={usersFilters.isLocked}
          openMenuOnClick
          isMulti
          extraPaddingY
          selectRef={statusRef}
        />
        <FilterDropdown
          name="roles"
          placeholder="Select Special Role"
          components={{ DropdownIndicator: CustomDropdownIndicator, Option: CustomCheckboxOptions }}
          options={roles}
          getOptionLabel={(option) => `${option.role.split('_').join(' ')}`}
          getOptionValue={(option) => option.id}
          value={usersFilters.roles}
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
          selectRef={roleRef}
        />
      </StyledUsersFiltersContent>
    </StyledUsersFiltersContainer>
  );
};

export default UsersFilters;

UsersFilters.propTypes = {
  onClearFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
  usersFilters: PropTypes.object,
  dropdownRefs: PropTypes.object,
  roles: PropTypes.arrayOf(PropTypes.object),
};
