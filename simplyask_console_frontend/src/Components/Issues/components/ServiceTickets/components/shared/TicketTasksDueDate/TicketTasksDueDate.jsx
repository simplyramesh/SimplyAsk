import { differenceInHours } from 'date-fns';
import React from 'react';

import ErrorCircle from '../../../../../../../Assets/icons/errorCircle.svg?component';
import WarningTriangle from '../../../../../../../Assets/icons/warningTriangle.svg?component';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../shared/styles/styled';

const renderTooltip = (children, title) => (
  <StyledTooltip title={title} arrow placement="top" p="10px 15px" maxWidth="auto">
    <StyledFlex as="span">{children}</StyledFlex>
  </StyledTooltip>
);
const TicketTasksDueDate = ({ children, val }) => {
  const hoursToDueDate = differenceInHours(new Date(val), new Date());

  const renderWarnings = () => {
    if (hoursToDueDate === 0) return null;

    if (hoursToDueDate <= 24) {
      return renderTooltip(<ErrorCircle />, 'This ticket is due within 24 hours');
    }
    if (hoursToDueDate <= 60) {
      return renderTooltip(<WarningTriangle />, 'This ticket is overdue by 5 days');
    }
    return null;
  };

  return (
    <StyledFlex direction="row" alignItems="center" gap="15px">
      {renderWarnings()}
      {children}
    </StyledFlex>
  );
};

export default TicketTasksDueDate;
