import { useTheme } from '@mui/material/styles';
import Select from 'react-select';

import { customStyles, filterStyles } from '../customStyles';

const FilterDropdown = ({ selectRef, styling, ...rest }) => {
  const theme = useTheme();

  return (
    <Select
      styles={{ ...customStyles, ...filterStyles, ...styling }}
      closeMenuOnSelect={false}
      default
      customTheme={theme}
      ref={selectRef}
      {...rest}
    />
  );
};

export default FilterDropdown;

FilterDropdown.propTypes = Select.propTypes;
