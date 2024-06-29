import PropTypes from 'prop-types';
import React from 'react';

import { StyledActionsItem, StyledActionsItemIcon, StyledActionsItemText } from './TableActionsStyled';

const ActionsItem = ({ Icon, children, onClick }) => {
  return (
    <StyledActionsItem onClick={(e) => onClick(e)}>
      {Icon && <StyledActionsItemIcon>{Icon}</StyledActionsItemIcon>}
      <StyledActionsItemText>{children}</StyledActionsItemText>
    </StyledActionsItem>
  );
};

ActionsItem.propTypes = {
  onClick: PropTypes.func,
  Icon: PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default ActionsItem;
