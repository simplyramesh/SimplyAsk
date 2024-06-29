import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import React from 'react';

import forms from '../../styles/forms.module.css';
import styles from './EmailAddressesForm.module.css';

const EmailAddressesForm = ({
  placeholder,
  title,
  inputValue,
  emailValues,
  onChange,
  onKeyPress,
  onRemove,
  validationMessage,
  isInvalid,
  onBlur,
}) => {
  return (
    <div className={forms.fieldset}>
      <label className={forms.label}>{title}</label>
      <div className={styles.emailItems}>
        {emailValues.map((email) => (
          <div className={styles.emailItem} key={email}>
            <span className={styles.emailItemText} title={email}>{email}</span>
            <CloseIcon
              className={styles.emailItemIcon}
              onClick={() => onRemove(email)}
              tabIndex={0}
              onKeyPress={() => onRemove(email)}
            />
          </div>
        ))}
      </div>
      <input
        className={`${forms.input} ${isInvalid && forms.invalid}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
      />
      {validationMessage}
    </div>
  );
};

export default EmailAddressesForm;

EmailAddressesForm.defaultProps = {
  placeholder: 'Insert Email Address',
  title: 'Email Addresses',
  inputValue: '',
  emailValues: [],
};

EmailAddressesForm.propTypes = {
  emailValues: PropTypes.arrayOf(PropTypes.string),
  inputValue: PropTypes.string,
  isInvalid: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string,
};
