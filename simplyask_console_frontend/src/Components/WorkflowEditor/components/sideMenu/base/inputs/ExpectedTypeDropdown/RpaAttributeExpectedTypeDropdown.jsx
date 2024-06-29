import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Select from 'react-select';

import { ERROR_TYPES } from '../../../../../utils/validation';
import CustomDropdownIndicator from '../DropdownSelector/CustomDropdownIndicator';
import { dropdownStyles } from './dropdownStyles';
import css from './ExpectedTypeDropdown.module.css';

const VALIDATION_TYPES = [
  { label: 'ID', value: 'ID' },
  { label: 'NAME', value: 'NAME' },
  { label: 'CLASS', value: 'CLASS' },
  { label: 'CSS_SELECTOR', value: 'CSS_SELECTOR' },
  { label: 'XPATH', value: 'XPATH' },
];

const RpaAttributeExpectedTypeDropdown = (props) => {
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
      placeholder="Locator Type"
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

export default memo(RpaAttributeExpectedTypeDropdown);

RpaAttributeExpectedTypeDropdown.propTypes = {
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
