import { ExpandMore } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';

import classes from './TicketsStatus.module.css';

const TicketsStatus = ({
  status,
  className,
  capital,
  removeBackground,
  sideModal,
  dropdownIcon,
}) => {
  return (
    <div
      className={`${classes.root} ${classes[status.toLowerCase()]} ${
        capital && classes.capital
      } ${removeBackground && classes.noBackground} ${
        sideModal && classes.sideModal
      } ${className}`}
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
  sideModal: false,
  dropdownIcon: false,
};

TicketsStatus.propTypes = {
  status: PropTypes.string,
  className: PropTypes.string,
  capital: PropTypes.bool,
  removeBackground: PropTypes.bool,
  sideModal: PropTypes.bool,
  dropdownIcon: PropTypes.bool,
};
