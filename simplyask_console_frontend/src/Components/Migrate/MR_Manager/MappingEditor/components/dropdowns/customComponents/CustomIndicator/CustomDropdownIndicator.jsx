import { components } from 'react-select';

import MappingEditorIcons from '../../../icons/MappingEditorIcons';
import css from './CustomDropdownIndicator.module.css';

const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <span className={css.dropdown_indicator}><MappingEditorIcons icon="DROPDOWN" /></span>
    </components.DropdownIndicator>
  );
};

export default CustomDropdownIndicator;
