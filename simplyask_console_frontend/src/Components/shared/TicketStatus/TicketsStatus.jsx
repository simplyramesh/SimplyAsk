import { ExpandMore } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledTicketsStatus } from './TicketStatus.styled';

const TicketsStatus = ({
  status,
  capital,
  sideModal,
  dropdownIcon,
  removeBackground,
}) => {
  if (!status) return '---';

  return (
    <StyledTicketsStatus
      status={status}
      capital={capital}
      sideModal={sideModal}
      removeBackground={removeBackground}
    >
      {status}
      {dropdownIcon && <ExpandMore />}
    </StyledTicketsStatus>
  );
};

export default TicketsStatus;

TicketsStatus.defaultProps = {
  capital: false,
  sideModal: false,
  dropdownIcon: false,
  removeBackground: false,
};

TicketsStatus.propTypes = {
  capital: PropTypes.bool,
  status: PropTypes.string,
  sideModal: PropTypes.bool,
  dropdownIcon: PropTypes.bool,
  removeBackground: PropTypes.bool,
};
