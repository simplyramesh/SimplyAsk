import React from 'react';

import { useUser } from '../../../../contexts/UserContext';
import { StyledNavbarButton } from './StyledNavbarButton';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';

const NavbarButton = ({ Icon, onClick, name, unread, isVisible, feedbackRef, ...otherProps }) => {
  const { isAccountDisabled } = useUser();

  if (!isVisible) return null;

  return (
    <StyledTooltip placement="bottom" title={name}>
      <StyledNavbarButton
        unread={unread}
        onClick={onClick}
        ref={feedbackRef}
        disabled={isAccountDisabled}
        {...otherProps}
      >
        <Icon />
      </StyledNavbarButton>
    </StyledTooltip>
  );
};

export default NavbarButton;
