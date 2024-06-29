import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

import CustomCheckboxOptions from '../customComponents/checkboxOptions/CustomCheckboxOptions';
import CustomDropdownIndicator from '../customComponents/dropdownIndicator/CustomDropdownIndicator';
import CustomGroup from '../customComponents/Group/CustomGroup';
import CustomValueContainer from '../customComponents/ValueContainer/CustomValueContainer';
import { customStyles } from '../customStyles';

import { primarySelectStyles } from './primarySelectStyles';

const PrimarySelect = ({ options, ...props }) => {
  const theme = useTheme();

  return (
    <Select
      components={{
        DropdownIndicator: CustomDropdownIndicator,
        Option: props?.withSeparator ? CustomCheckboxOptions : components.Option,
        Group: props?.withMultiSelect ? CustomGroup : components.Group,
        ValueContainer: props?.withMultiSelect ? CustomValueContainer : components.ValueContainer,
      }}
      styles={{ ...customStyles, ...primarySelectStyles }}
      options={options}
      closeMenuOnSelect={!props?.withSeparator}
      customTheme={theme}
      {...props}
    />
  );
};

export default PrimarySelect;

PrimarySelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  withSeparator: PropTypes.bool,
  withMultiSelect: PropTypes.bool,
};
