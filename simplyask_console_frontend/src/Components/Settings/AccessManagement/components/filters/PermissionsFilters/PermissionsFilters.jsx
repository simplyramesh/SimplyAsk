import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import { getPermissionSummary } from '../../../../../../Services/axios/permissions';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { constructUrlSearchString } from '../../../utils/formatters';
import CustomCalendarIndicator from '../../dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../dropdowns/customComponents/calendarMenu/CustomCalendarMenu';
import CustomCheckboxOptions from '../../dropdowns/customComponents/checkboxOptions/CustomCheckboxOptions';
import CustomDropdownIndicator from '../../dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import FilterDropdown from '../../dropdowns/FilterDropdown/FilterDropdown';

const ASSIGNMENT_FILTER_OPTIONS = [
  {
    value: 'userId',
    label: 'Directly Assigned',
  },
  {
    value: 'permissionGroupId',
    label: 'Inherited From Permission Groups',
  },
  {
    value: 'userGroupId',
    label: 'Inherited From User Groups',
  },
];

const removeDuplicates = (arr, prop, start) => {
  if (!start) return [];

  const removed = arr.reduce((acc, item) => {
    const key = prop.split('.').reduce((a, b) => a[b], item);
    const found = acc.find((i) => i.value === key);

    if (!found) acc.push({ label: key, param: 'category', value: key }); // not really reusable for at least 2 reasons: 1. value is hardcoded, 2. geared for react-select options

    return acc;
  }, []);

  return removed;
};

const PermissionsFilters = ({ permissionsFilters, onFilterChange, onClearFilters }) => {
  const { id: userId } = useParams();

  const accessLevelInitialState = {
    inclusiveSearch: 'false',
    pageSize: '200',
    permissionTypes: 'API_PERMISSION',
    userId: [userId],
  };

  const allPagePermissionsUrl = constructUrlSearchString(accessLevelInitialState);

  const { data: allPagePermissions, isSuccess } = useQuery({
    queryKey: ['allPagePermissions', allPagePermissionsUrl],
    queryFn: () => getPermissionSummary(allPagePermissionsUrl),
    enabled: !!allPagePermissionsUrl,
  });

  const pageCategories = removeDuplicates(allPagePermissions?.content, 'permission.pageCategory', isSuccess);

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <StyledButton variant="text" onClick={onClearFilters}>
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex w="100%">
        <FilterDropdown
          name="created"
          placeholder="Date Added"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          onFilterSelect={onFilterChange}
          filterValue={permissionsFilters?.createdDate}
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          isDateModified
          minMenuHeight={600}
          maxMenuHeight={600}
        />
        <FilterDropdown
          name="category" // IMPORTANT: name must be the same as the API key for filter change
          placeholder="Category"
          components={{
            DropdownIndicator: CustomDropdownIndicator,
            Option: CustomCheckboxOptions,
          }}
          options={pageCategories}
          onChange={onFilterChange}
          filterValue={permissionsFilters?.category}
          isSearchable={false}
          closeMenuOnSelect={false}
          isClearable={false}
          hideSelectedOptions={false}
          openMenuOnClick
          isMulti
          extraPaddingY
          labelKey="category"
          valueKey="category"
        />
        {/* <FilterDropdown
          name="accessLevels"
          placeholder="Access"
          components={{ DropdownIndicator: CustomDropdownIndicator, Option: CustomCheckboxOptions }}
          options={ACCESS_FILTER_OPTIONS}
          onChange={onFilterChange}
          extraPaddingY
          openMenuOnClick
          isSearchable={false}
          closeMenuOnSelect={false}
          isClearable={false}
          hideSelectedOptions={false}
          isMulti
          labelKey="access"
          valueKey="accessLevels"
        /> */}
        <FilterDropdown
          name="assignment"
          placeholder="Assignment"
          components={{ DropdownIndicator: CustomDropdownIndicator, Option: CustomCheckboxOptions }}
          options={ASSIGNMENT_FILTER_OPTIONS}
          onChange={onFilterChange}
          extraPaddingY
          openMenuOnClick
          isSearchable={false}
          closeMenuOnSelect={false}
          isClearable={false}
          hideSelectedOptions={false}
          isMulti
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default PermissionsFilters;

PermissionsFilters.propTypes = {
  onClearFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
  permissionsFilters: PropTypes.object,
};
