import PropTypes from 'prop-types';

import { Typography } from '../../base';
import { VALIDATION_MESSAGE_KEYS } from '../../SideMenu';
import css from './ValidationMessage.module.css';

const variantMapping = {
  [VALIDATION_MESSAGE_KEYS.REQUIRED_FIELDS_COMPLETED]: css.ofCompleted,
};

const ValidationMessage = ({ variant, message, color }) => {
  return (
    <div className={variantMapping[variant]}>
      <Typography variant="small" color={color} weight="bold">{message}</Typography>
    </div>
  );
};

export default ValidationMessage;

ValidationMessage.propTypes = {
  variant: PropTypes.oneOf([VALIDATION_MESSAGE_KEYS.REQUIRED_FIELDS_COMPLETED]),
  message: PropTypes.string,
  color: PropTypes.string,
};
