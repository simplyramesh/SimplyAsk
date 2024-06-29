import PropTypes from 'prop-types';
import React from 'react';

import ErrorIcon from '../../../../Assets/icons/alertRedIcon.svg?component';
import forms from '../../styles/forms.module.css';

const FormValidationMessage = ({ text }) => {
  if (!text) return null;

  return (
    <div className={forms.errorMessage}>
      <ErrorIcon className={forms.errorMessageIcon} />
      <span className={forms.errorMessageText}>{text}</span>
    </div>
  );
};

export default FormValidationMessage;

FormValidationMessage.propTypes = {
  text: PropTypes.string,
};
