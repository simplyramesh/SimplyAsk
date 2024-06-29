import { components } from 'react-select';

import DropDownIcon from '../../../../../../Assets/icons/arrowDropDown.svg?component';
import css from './ExecuteTestSuiteModal.module.css';

const CustomDropdownIndicator = (props) => {
  const { DropdownIndicator } = components;

  return (
    <DropdownIndicator {...props}>
      <span className={css.dropdown_indicator}>
        <DropDownIcon />
      </span>
    </DropdownIndicator>
  );
};

export default CustomDropdownIndicator;
