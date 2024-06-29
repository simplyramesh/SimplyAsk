import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Select from 'react-select';

import CustomDropdownIndicator from '../customComponents/dropdownIndicator/CustomDropdownIndicator';
import { customStyles, formStyles } from '../customStyles';

// Select is setup to work with Formik validation
const FormDropdown = ({ options, ...props }) => {
  const theme = useTheme();

  return (
    <Select
      {...props}
      options={options}
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      styles={{ ...customStyles, ...formStyles }}
      closeMenuOnSelect
      default
      customTheme={theme}
    />
  );
};

export default FormDropdown;

FormDropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
};
