import { ExpandMore } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';

import classes from './TicketsStatus.module.css';

// TODO: sideModal prop is included in TicketsModalView (line 267). Uncomment propType when included in this component.
const TicketsStatus = ({
  status, className, capital, removeBackground, dropdownIcon,
}) => {
  return (
    <div
      className={`${classes.root} ${classes[status?.toLowerCase().replace(/ /g, '')]} ${
        capital && classes.capital
      } ${removeBackground && classes.noBackground} ${className}`}
    >
      {status}
      {dropdownIcon && <ExpandMore />}
    </div>
  );
};

export default TicketsStatus;

TicketsStatus.defaultProps = {
  capital: false,
  removeBackground: false,
  dropdownIcon: false,
};

TicketsStatus.propTypes = {
  status: PropTypes.string,
  className: PropTypes.string,
  capital: PropTypes.bool,
  removeBackground: PropTypes.bool,
  dropdownIcon: PropTypes.bool,
  // TODO: uncomment when sideModal prop is included in this component.
  // sideModal: PropTypes.bool,
};
