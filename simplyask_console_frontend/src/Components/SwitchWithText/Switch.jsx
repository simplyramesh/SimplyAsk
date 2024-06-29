import PropTypes from 'prop-types';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

import colors from '../../config/colors';
import classes from './Switch.module.css';

const Switch = ({
  checked,
  onChange,
  activeColor = colors.secondary,
  inactiveColor = colors.switchBg,
  thumbColor,
  activeLabel = 'Enabled',
  inactiveLabel = 'Disabled',
  disabled,
  className,
  thumbClassName,
  disableOrangeColor,
  style,
  ...otherProps
}) => {
  return (
    <div
      className={`${classes.root} ${!checked && classes.inactive} ${disableOrangeColor && classes.inactiveColor} ${
        disabled && classes.disabled
      } ${className}`}
      onClick={() => onChange(disabled ? checked : !checked)}
      style={{
        ...style,
        '--switch-main-color': checked ? activeColor : inactiveColor,
        '--switch-thumb-color': checked ? colors.white : colors.black,
      }}
      {...otherProps}
    >
      {checked && <CheckIcon fontSize="small" />}
      <span className={classes.label}>{checked ? activeLabel : inactiveLabel}</span>
      <div className={`${thumbClassName} ${classes.thumb}`} />
    </div>
  );
};

export default Switch;

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  thumbColor: PropTypes.string,
  activeLabel: PropTypes.string,
  inactiveLabel: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  thumbClassName: PropTypes.string,
  disableOrangeColor: PropTypes.bool,
};
