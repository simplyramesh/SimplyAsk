import { components } from 'react-select';

import DropDownIcon from '../../../../../Assets/Icons/arrowDropDown.svg?component';
import css from './DropdownSelector.module.css';

const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <span className={css.dropdown_indicator}>
        <DropDownIcon />
      </span>
    </components.DropdownIndicator>
  );
};

export default CustomDropdownIndicator;
