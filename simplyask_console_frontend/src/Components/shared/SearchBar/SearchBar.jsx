import PropTypes from 'prop-types';
import { useState } from 'react';

import SearchIcon from '../../../Assets/icons/searchIcon.svg?component';

import { StyledSearchBarContainer, StyledSearchBarIcon, StyledSearchBarInput } from './StyledSearchBar';

const SearchBar = ({
  placeholder = 'Search',
  onChange = () => {},
  maxWidth,
  width,
  fontSize,
  onSearchButtonClick,
  initialSearchValue = '',
  ...props
}) => {
  const [value, setValue] = useState(initialSearchValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <StyledSearchBarContainer maxWidth={maxWidth} width={width}>
      <StyledSearchBarInput
        value={value}
        {...props}
        placeholder={placeholder}
        onChange={handleChange}
        type="text"
        fontSize={fontSize}
        {...props}
      />
      <StyledSearchBarIcon onClick={onSearchButtonClick}>
        <SearchIcon />
      </StyledSearchBarIcon>
    </StyledSearchBarContainer>
  );
};

export default SearchBar;

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  maxWidth: PropTypes.string,
};
