import PropTypes from 'prop-types';

import CustomDropdownIndicator from '../customComponents/CustomIndicator/CustomDropdownIndicator';
import { customStyles } from './customStyles';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const FieldDropdown = ({ value, options, placeholder, isDisabled, onSelectChange }) => {
  return (
    <CustomSelect
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      value={value}
      onChange={onSelectChange}
      placeholder={placeholder}
      options={options}
      styles={{ ...customStyles }}
      isSearchable={false}
      closeMenuOnScroll
      closeMenuOnSelect
      openMenuOnClick
      isDisabled={isDisabled}
    />
  );
};

export default FieldDropdown;

FieldDropdown.propTypes = {
  value: PropTypes.object,
  isDisabled: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  onSelectChange: PropTypes.func,
};
