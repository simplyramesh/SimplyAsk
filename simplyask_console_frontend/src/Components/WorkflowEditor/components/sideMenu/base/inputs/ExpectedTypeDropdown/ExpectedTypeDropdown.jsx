import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Select from 'react-select';

import { ERROR_TYPES } from '../../../../../utils/validation';
import CustomDropdownIndicator from '../DropdownSelector/CustomDropdownIndicator';
import { dropdownStyles } from './dropdownStyles';
import css from './ExpectedTypeDropdown.module.css';

const VALIDATION_TYPES = [
  { label: 'ANYTHING', value: 'ANYTHING' },
  { label: 'NUMBER', value: 'NUMBER' },
  { label: 'ALPHANUMERIC', value: 'ALPHANUMERIC' },
  { label: 'ALPHABET', value: 'ALPHABET' },
  { label: 'OBJECT', value: 'OBJECT' },
  { label: 'GENERIC', value: 'GENERIC' },
  { label: 'ADDRESS', value: 'ADDRESS' },
  { label: 'DATE_OF_BIRTH', value: 'DATE_OF_BIRTH' },
  { label: 'POSTAL_CODE', value: 'POSTAL_CODE' },
  { label: 'ZIP_CODE', value: 'ZIP_CODE' },
  { label: 'PHONE_NUMBER', value: 'PHONE_NUMBER' },
  { label: 'BOOLEAN', value: 'BOOLEAN' },
  { label: 'EMAIL', value: 'EMAIL' },
];

const ExpectedTypeDropdown = (props) => {
  const {
    error, value, onChange,
  } = props;

  if (!value) onChange(VALIDATION_TYPES[0].value);

  return (
    <Select
      className={classnames({
        [css.error]: error?.type === ERROR_TYPES.ERROR,
        [css.warning]: error?.type === ERROR_TYPES.WARNING,
      })}
      options={VALIDATION_TYPES}
      placeholder="Expected Type for Validation"
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

export default memo(ExpectedTypeDropdown);

ExpectedTypeDropdown.propTypes = {
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
