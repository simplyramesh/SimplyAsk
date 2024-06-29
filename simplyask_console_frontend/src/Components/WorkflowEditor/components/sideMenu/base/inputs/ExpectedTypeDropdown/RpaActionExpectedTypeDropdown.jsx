import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Select from 'react-select';

import { ERROR_TYPES } from '../../../../../utils/validation';
import CustomDropdownIndicator from '../DropdownSelector/CustomDropdownIndicator';
import { dropdownStyles } from './dropdownStyles';
import css from './ExpectedTypeDropdown.module.css';

const VALIDATION_TYPES = [
  { label: 'OPEN_URL', value: 'OPEN_URL' },
  { label: 'CLICK_BUTTON', value: 'CLICK_BUTTON' },
  { label: 'VALIDATE_ELEMENT', value: 'VALIDATE_ELEMENT' },
  { label: 'VALIDATE_ELEMENT_CONTAINS', value: 'VALIDATE_ELEMENT_CONTAINS' },
  { label: 'SELECT_CHECKBOX', value: 'SELECT_CHECKBOX' },
  { label: 'CLICK_LINK', value: 'CLICK_LINK' },
  { label: 'INPUT_TEXT', value: 'INPUT_TEXT' },
  { label: 'SELECT_DROPDOWN', value: 'SELECT_DROPDOWN' },
  { label: 'TAKE_SCREENSHOT', value: 'TAKE_SCREENSHOT' },
  { label: 'SLEEP', value: 'SLEEP' },
];

const RpaActionExpectedTypeDropdown = (props) => {
  const {
    error, value, onChange,
  } = props;

  return (
    <Select
      className={classnames({
        [css.error]: error?.type === ERROR_TYPES.ERROR,
        [css.warning]: error?.type === ERROR_TYPES.WARNING,
      })}
      options={VALIDATION_TYPES}
      placeholder="Action Type"
      value={VALIDATION_TYPES.find((option) => option.value === value)}
      onChange={(val) => onChange(val.value)}
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      styles={dropdownStyles}
      maxMenuHeight={300}
      closeMenuOnSelect
      closeMenuOnScroll
    />
  );
};

export default memo(RpaActionExpectedTypeDropdown);

RpaActionExpectedTypeDropdown.propTypes = {
  error: PropTypes.shape({
    type: PropTypes.oneOf([ERROR_TYPES.ERROR, ERROR_TYPES.WARNING]),
    message: PropTypes.string,
  }),
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
};
