import styled from '@emotion/styled';
import { components } from 'react-select';

import SearchIcon from '../../Assets/icons/searchIcon.svg?component';
import { StyledSearchBarIcon } from '../shared/SearchBar/StyledSearchBar';
import { StyledFlex } from '../shared/styles/styled';
import { StyledZoomControl } from '../Managers/shared/components/StyledFlowEditor';

export const StyledProductOfferingSearch = styled(StyledFlex)`
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayBg};
    border-radius: 10px;
    cursor: pointer;
  }
`;

export const StyledSearchIconProductOffering = styled(StyledSearchBarIcon)`
  & > svg {
    width: 24px;
    height: 24px;
  }
`;

export const StyledProductsFilterSortButton = styled(StyledZoomControl)`
  line-height: 24px;
  white-space: nowrap;
`;

export const StyledProductsQuantityDropdown = styled(StyledZoomControl)`
  line-height: 24px;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledSearchIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <StyledSearchIconProductOffering>
      <SearchIcon />
    </StyledSearchIconProductOffering>
  </components.DropdownIndicator>
);
